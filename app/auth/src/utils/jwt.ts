import jwt from "jsonwebtoken"

import { jwtPayloadAccessToken , jwtPayloadRefershToken } from "../types/jwt.types";
import { jwtConfigAccessToken, jwtConfigRefershToken } from "../config/jwt"



// give the json web token 
export function generateAccessToken(payload : jwtPayloadAccessToken){
    const options: jwt.SignOptions = {
        expiresIn: jwtConfigAccessToken.expiry_time as jwt.SignOptions["expiresIn"],
        algorithm: jwtConfigAccessToken.algorithm as jwt.Algorithm
    };
    
    return jwt.sign(payload, jwtConfigAccessToken.secret_key, options);
}

// generating the refersh token 
export function generateRefershToken(payload : jwtPayloadRefershToken , expireTime : string){
     const options: jwt.SignOptions = {
        expiresIn: parseInt(expireTime) , 
        algorithm: jwtConfigRefershToken.algorithm as jwt.Algorithm
    };
    
    return jwt.sign(payload, jwtConfigRefershToken.secret_key, options);
}


