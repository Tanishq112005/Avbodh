import {
  OTP_EXPIRE_TIME,
  GOOGLE_CLIENT_ID,
  JWT_SECRET_REFERSH_TOKEN,
} from '../config/env';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { emailProducer } from '../rabbitmq/producers/email-producer';
import { user } from '../repositories/user.db';
import {
  jwtPayloadAccessToken,
  jwtPayloadRefershToken,
} from '../types/jwt.types';
import { ApiError, ApiResponse } from '@avbodh/typescript';
import { random6digitnumber } from '../utils/generateOtp';
import { generateAccessToken, generateRefershToken } from '../utils/jwt';
import { comparePasswords, hashPassword } from '../utils/password';
import { redisClient } from '../lib/redis';
import {
  NotificationMessage,
  NotificationBuilder,
  verifiyingRefeshToken,
  userDetails,
  userSignInputDetails,
} from '@avbodh/typescript';
import {  RedisClientType } from 'redis';



export class AuthController {
 
  private redis : RedisClientType | any ;
  constructor(redis : RedisClientType | any) {
    this.redis = redis;
  }

  public createUser = async (req: any, res: any) => {
    const { name, email, password, type } = req.body;
    try {
      // step-1: first creating the hashpassword
      const hashedPassword: string = await hashPassword(password);
      
      // step-2:  then creating the Payload
      const signinPayload: userSignInputDetails = {
        name: name,
        email: email,
        password: hashedPassword,
        type: type,
      };
      

      // step-3: checking the user is Present 
      const checkingUserPresent = await user.checkingUserPresent(email);

      if (checkingUserPresent && checkingUserPresent.is_verified) {
        return res.status(409).json(new ApiError('User already exists'));
      }
      if (!checkingUserPresent) {
        const creatingUser = await user.creatingUser(signinPayload);
      }
      

      // step-4: generate the 6 digit number 
      const otp = random6digitnumber();

      const redis_key = `auth:${email}`;
      const otp_expire_time = Number(OTP_EXPIRE_TIME) || 300;
        
      // step-5: Making the Notification Payload 
      const payload: NotificationMessage = new NotificationBuilder()
        .setToEmail(email)
        .setSubject('Verify Account')
        .setType('EMAIL')
        .setContent(
          `Your verification OTP is ${otp} and it will expire after ${
            otp_expire_time / 60
          } minutes`,
        )
        .build();
       
      // step-6: Sending the Email   
      await emailProducer.send(payload);

      console.log(`Saving OTP to Redis for ${email}...`);
      await this.redis.setEx(redis_key, otp_expire_time, String(otp));

      console.log('Saved to Redis');
      return res.status(200).json(new ApiResponse('OTP is Sent Successfully'));
    } catch (err: any) {
      console.error("Signup Error:", err);
      return res
        .status(500)
        .json(new ApiError('Error in user creation or sending the OTP', err.message || err));
    }
  };
  

 
  public verifySignupOtp = async (req: any, res: any) => {
    const { email, otp } = req.body;

    try {
      const key = `auth:${email}`;
      const storedOtp = await redisClient.get(key);

      if (!storedOtp || storedOtp !== String(otp)) {
        return res.status(404).json(new ApiError('OTP is expired or invalid'));
      }

      // OTP verified, now delete it to prevent reuse
      await this.redis.del(key);

      await user.changingIsVerifiedStatus(email);
      const informationOfUser: any = await user.checkingUserPresent(email);

      const payload: jwtPayloadAccessToken = {
        id: informationOfUser.id,
        email: informationOfUser.email,
        name: informationOfUser.name,
        type: informationOfUser.type,
      };
      const accessToken: string = generateAccessToken(payload);

      const refreshToken = generateRefershToken(
        { id: informationOfUser.id },
        '1d',
      );
      await user.updateRefershToken(email, refreshToken);

      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.status(200).json(
        new ApiResponse('Account verified and logged in successfully', {
          accessToken: accessToken,
        }),
      );
    } catch (err: any) {
      return res
        .status(500)
        .json(new ApiError('Error in verifying signup OTP', err));
    }
  };

  public verifyForgotPasswordOtp = async (req: any, res: any) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json(new ApiError('Email and OTP are required'));
    }

    try {
      const key = `auth:${email}`;
      const storedOtp = await this.redis.get(key);

      if (!storedOtp || storedOtp !== String(otp)) {
        return res.status(400).json(new ApiError('OTP is expired or invalid'));
      }

      // Delete OTP after successful verification
      await this.redis.del(key);

      const userDetails = await user.userDetails(email);

      if (!userDetails) {
        return res.status(404).json(new ApiError('User account not found'));
      }

      const payload: jwtPayloadAccessToken = {
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        type: userDetails.type,
      };
      const accessToken: string = generateAccessToken(payload);

      return res.status(200).json(
        new ApiResponse('Your Password is Changed, Please Login Again', {
          accessToken: accessToken,
        }),
      );
    } catch (err: any) {
      return res
        .status(500)
        .json(new ApiError('Error verifying forgot password OTP', err));
    }
  };

  public forgotPasswordVerification = async (req: any, res: any) => {
    const { email } = req.body;
    try {
      const userDetails: any = await user.checkingUserPresent(email);
      if (userDetails) {
        const otp = random6digitnumber();
        const redis_key = `auth:${email}`;
        const otp_expire_time = Number(OTP_EXPIRE_TIME) || 300;

        const payload: NotificationMessage = new NotificationBuilder()
          .setToEmail(email)
          .setSubject('Forgot Password OTP')
          .setType('EMAIL')
          .setContent(
            `OTP To Reset Password is ${otp}, it will expire after ${
              otp_expire_time / 60
            } minutes`,
          )
          .build();

        await emailProducer.send(payload);

        await this.redis.setEx(redis_key, otp_expire_time, String(otp));
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            'If an account exists, a code has been sent to your email.',
          ),
        );
    } catch (err: any) {
      return res
        .status(404)
        .json(
          new ApiError('Error in sending the otp for the forgotPassword', err),
        );
    }
  };

  public forgotPasswordChange = async (req: any, res: any) => {
    const { password } = req.body;
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];
      let originalUserId = req.user;

      if (accessToken) {
        const { verifyAccessToken } = require('../utils/jwt');
        const decoded = verifyAccessToken(accessToken);
        if (decoded && decoded.id) {
          originalUserId = decoded.id;
        }
      }

      const userId = originalUserId;

      console.log(
        'DEBUG: passwordChange: req.userId =',
        req.userId,
        'req.user =',
        req.user,
        'final userId =',
        userId,
      );

      const userDetails = await user.userDetailsThroughId(userId);
      if (!userDetails) {
        return res
          .status(404)
          .json(new ApiError('User not found during password change.'));
      }

      const hashedPassword: string = await hashPassword(password);
      await user.updatePassword(userId, hashedPassword);

      return res
        .status(200)
        .json(
          new ApiResponse(
            'Password is changed successfully. Please log in again.',
          ),
        );
    } catch (err: any) {
      return res
        .status(404)
        .json(new ApiError('Error in changing the password', err));
    }
  };


  // for loging the User 
  public login = async (req: any, res: any) => {
    const { email, password, remberMe } = req.body;
    try {
      const userdetails: userDetails | null = await user.userDetails(email);
      if (!userdetails) {
        return res.status(404).json(new ApiError('No Such user is found out'));
      }

      const valid = await comparePasswords(password, userdetails.password);
      if (!valid) {
        return res.status(404).json(new ApiError('Invalid Password'));
      }

      const userId: string = userdetails.id;

      const jwtPayloadAccessToken: jwtPayloadAccessToken = {
        id: userId,
        name: userdetails.name,
        email: userdetails.email,
        type: userdetails.type,
      };

      const jwtPayloadRefershToken: jwtPayloadRefershToken = {
        id: userId,
      };

      const accessToken: string = generateAccessToken(jwtPayloadAccessToken);
      var refreshToken;
      if (remberMe) {
        refreshToken = generateRefershToken(jwtPayloadRefershToken, '30d');
      } else {
        refreshToken = generateRefershToken(jwtPayloadRefershToken, '1d');
      }

      await user.updateRefershToken(email, refreshToken);
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      return res.status(200).json(
        new ApiResponse('User is found, and successfully logged in', {
          accessToken: accessToken,
        }),
      );
    } catch (err: any) {
      return res
        .status(500)
        .json(new ApiError('Error in verifying the user', err));
    }
  };

  public refershToken = async (req: any, res: any) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res
        .status(401)
        .json(new ApiError('Unauthorized. Please login again.'));
    }

    try {
      const decoded = await verifiyingRefeshToken(
        incomingRefreshToken,
        JWT_SECRET_REFERSH_TOKEN as string
      );

      const userId = decoded.id;
      const userDetails = await user.userDetailsThroughId(userId);

      if (userDetails.refresh_token != incomingRefreshToken) {
        return res.status(401).json(new ApiError('Refresh Token is incorrect'));
      }

      const newAccessToken = generateAccessToken({
        id: userId,
        name: userDetails.name,
        email: userDetails.email,
        type: userDetails.type,
      });

      return res.status(200).json(
        new ApiResponse('Access token refreshed', {
          accessToken: newAccessToken,
        }),
      );
    } catch (err: any) {
      res.clearCookie('refreshToken');
      return res
        .status(401)
        .json(new ApiError('Session expired. Please login again.', err));
    }
  };

  public googleLogin = async (req: any, res: any) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json(new ApiError('idToken is required'));
    }

    try {
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        return res
          .status(400)
          .json(new ApiError('Invalid Google token payload'));
      }

      const { email, name, email_verified } = payload;

      if (!email || !email_verified) {
        return res
          .status(400)
          .json(new ApiError('Google email not verified or missing'));
      }

      let informationOfUser = await user.checkingUserPresent(email);

      if (!informationOfUser) {
        // User does not exist, create a new one with random dummy password
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await hashPassword(randomPassword);

        const signinPayload: userSignInputDetails = {
          name: name || 'User',
          email: email,
          password: hashedPassword,
          type: 'User',
        };

        await user.creatingUser(signinPayload);
        // creatingUser sets is_verified to false by default, so we immediately set it to true
        await user.changingIsVerifiedStatus(email);
        informationOfUser = await user.checkingUserPresent(email);
      } else if (!informationOfUser.is_verified) {
        // User exists but is not verified (started manual signup but didn't finish)
        await user.changingIsVerifiedStatus(email);

        informationOfUser.is_verified = true;
      }

      if (!informationOfUser) {
        return res
          .status(500)
          .json(new ApiError('Failed to fetch or create user'));
      }

      // Generate JWTs
      const jwtPayload: jwtPayloadAccessToken = {
        id: informationOfUser.id,
        email: informationOfUser.email,
        name: informationOfUser.name,
        type: informationOfUser.type,
      };

      const accessToken = generateAccessToken(jwtPayload);
      const refreshToken = generateRefershToken(
        { id: informationOfUser.id },
        '1d',
      );

      await user.updateRefershToken(email, refreshToken);

      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.status(200).json(
        new ApiResponse('Logged in successfully with Google', {
          accessToken,
        }),
      );
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      return res
        .status(500)
        .json(new ApiError('Error verifying Google Token', err));
    }
  };

  public logout = async (req: any, res: any) => {
    try {
      const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

      // 1. If a token exists, find the user and remove it from the database
      if (incomingRefreshToken) {
        try {
          const decoded = await verifiyingRefeshToken(
            incomingRefreshToken,
            JWT_SECRET_REFERSH_TOKEN as string
          );

          if (decoded && decoded.id) {
            const userDetails = await user.userDetailsThroughId(decoded.id);

            if (userDetails) {
              // Pass null or an empty string depending on your Prisma schema requirements
              await user.updateRefershToken(userDetails.email, '');
            }
          }
        } catch (tokenError) {
          // If the token is already expired or invalid, we can safely ignore the error
          // and proceed to clean the client's cookies anyway.
          console.log('Token invalid/expired during logout process.');
        }
      }

      // 2. Clear the cookie from the browser
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      });

      // 3. Return a successful response
      return res
        .status(200)
        .json(new ApiResponse('User logged out successfully'));
    } catch (err: any) {
      return res
        .status(500)
        .json(new ApiError('Error occurred during logout', err));
    }
  };
}

export const authController = new AuthController(redisClient);
