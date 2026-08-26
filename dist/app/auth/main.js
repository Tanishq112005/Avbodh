"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// app/auth/src/config/env.ts
var import_dotenv, import_path, import_fs, envPaths, NOMIC_API_KEY, PORT, SUBMIT_CHAPTER_WISE_PORT, JWT_SECRET_ACCESS_TOKEN, JWT_TEMP_EXPIRES_IN_ACCESS_TOKEN, JWT_ALGORITHM_ACCESS_TOKEN, JWT_SECRET_REFERSH_TOKEN, JWT_TEMP_EXPIRES_IN_REFERSH_TOKEN, JWT_ALGORITHM_REFERSH_TOKEN, DATABASE_URL, DATABASE_URL_PRODUCTION, DATABASE_REPICA_URL, REDIS_HOST, REDIS_PORT, GOOGLE_AUTH_PASSWORD, INTERNAL_API_SECRET, OTP_EXPIRE_TIME, SALT_ROUND, MAX_ATTEMENTS, WINDOW_SIZE, REDIS_PASSWORD, REDIS_USERNAME, GEMINI_API_KEY, BACKBLAZE_REGION, BACKBLAZE_ENDPOINT, BUCKET_NAME, IMAGE_EXPIRE_TIME, BACKBLAZE_KEY_ID, BACKBLAZE_APP_KEY, IV_LENGTH, ENCRYPTION_KEY, BUCKET_ID, IMAGE_WORKER_BASE_URL, EMAIL_WORKER_PORT, UPDATE_WORKER_PORT, WATCHDOG_PORT, WATCHDOG_INTERVAL, WATCHDOG_INACTIVITY_THRESHOLD_SEC, EVALUATION_WORKER_PORT, STUDENT_TEST_ANALYTICS_WORKER_PORT, EMAIL_ADDING_WORKER_PORT, TOKEN_BUCKET_CAPACITY, TOKEN_BUCKET_REFLIER, QUESTION_STORE_REDIS_URL, QUESTION_STORE_REDIS_PORT, QUESTION_STORE_REDIS_USERNAME, QUESTION_STORE_REDIS_HOST, QUESTION_STORE_REDIS_PASSWORD, GOOGLE_CLIENT_ID, REDIS_CACHE_EXPIRATION_SECONDS, REDIS_URL, QUEUE_PASSWORD, QUEUE_PORT, QUEUE_URL, QUEUE_HOST, QUEUE_EXCHANGE, QUEUE_ROUTING_EMAIL;
var init_env = __esm({
  "app/auth/src/config/env.ts"() {
    "use strict";
    import_dotenv = __toESM(require("dotenv"));
    import_path = __toESM(require("path"));
    import_fs = __toESM(require("fs"));
    process.env.DOTENV_QUIET = "true";
    envPaths = [
      import_path.default.join(process.cwd(), ".env"),
      import_path.default.join(process.cwd(), "app/auth/.env")
    ];
    for (const p of envPaths) {
      if (import_fs.default.existsSync(p)) {
        import_dotenv.default.config({ path: p });
        break;
      }
    }
    ({
      NOMIC_API_KEY,
      PORT,
      SUBMIT_CHAPTER_WISE_PORT,
      JWT_SECRET_ACCESS_TOKEN,
      JWT_TEMP_EXPIRES_IN_ACCESS_TOKEN,
      JWT_ALGORITHM_ACCESS_TOKEN,
      JWT_SECRET_REFERSH_TOKEN,
      JWT_TEMP_EXPIRES_IN_REFERSH_TOKEN,
      JWT_ALGORITHM_REFERSH_TOKEN,
      DATABASE_URL,
      DATABASE_URL_PRODUCTION,
      DATABASE_REPICA_URL,
      REDIS_HOST,
      REDIS_PORT,
      GOOGLE_AUTH_PASSWORD,
      INTERNAL_API_SECRET,
      OTP_EXPIRE_TIME,
      SALT_ROUND,
      MAX_ATTEMENTS,
      WINDOW_SIZE,
      REDIS_PASSWORD,
      REDIS_USERNAME,
      GEMINI_API_KEY,
      BACKBLAZE_REGION,
      BACKBLAZE_ENDPOINT,
      BUCKET_NAME,
      IMAGE_EXPIRE_TIME,
      BACKBLAZE_KEY_ID,
      BACKBLAZE_APP_KEY,
      IV_LENGTH,
      ENCRYPTION_KEY,
      BUCKET_ID,
      IMAGE_WORKER_BASE_URL,
      EMAIL_WORKER_PORT,
      UPDATE_WORKER_PORT,
      WATCHDOG_PORT,
      WATCHDOG_INTERVAL,
      WATCHDOG_INACTIVITY_THRESHOLD_SEC,
      EVALUATION_WORKER_PORT,
      STUDENT_TEST_ANALYTICS_WORKER_PORT,
      EMAIL_ADDING_WORKER_PORT,
      TOKEN_BUCKET_CAPACITY,
      TOKEN_BUCKET_REFLIER,
      QUESTION_STORE_REDIS_URL,
      QUESTION_STORE_REDIS_PORT,
      QUESTION_STORE_REDIS_USERNAME,
      QUESTION_STORE_REDIS_HOST,
      QUESTION_STORE_REDIS_PASSWORD,
      GOOGLE_CLIENT_ID,
      REDIS_CACHE_EXPIRATION_SECONDS,
      REDIS_URL,
      QUEUE_PASSWORD,
      QUEUE_PORT,
      QUEUE_URL,
      QUEUE_HOST,
      QUEUE_EXCHANGE,
      QUEUE_ROUTING_EMAIL
    } = process.env);
  }
});

// app/auth/src/config/jwt.ts
var jwtConfigAccessToken, jwtConfigRefershToken;
var init_jwt = __esm({
  "app/auth/src/config/jwt.ts"() {
    "use strict";
    init_env();
    jwtConfigAccessToken = {
      secret_key: JWT_SECRET_ACCESS_TOKEN,
      expiry_time: JWT_TEMP_EXPIRES_IN_ACCESS_TOKEN,
      algorithm: JWT_ALGORITHM_ACCESS_TOKEN
    };
    jwtConfigRefershToken = {
      secret_key: JWT_SECRET_REFERSH_TOKEN,
      algorithm: JWT_ALGORITHM_REFERSH_TOKEN
    };
  }
});

// app/auth/src/utils/jwt.ts
var jwt_exports = {};
__export(jwt_exports, {
  generateAccessToken: () => generateAccessToken,
  generateRefershToken: () => generateRefershToken,
  verifyAccessToken: () => verifyAccessToken
});
function generateAccessToken(payload) {
  const options = {
    expiresIn: jwtConfigAccessToken.expiry_time,
    algorithm: jwtConfigAccessToken.algorithm
  };
  return import_jsonwebtoken2.default.sign(payload, jwtConfigAccessToken.secret_key, options);
}
function generateRefershToken(payload, expireTime) {
  const options = {
    expiresIn: expireTime,
    algorithm: jwtConfigRefershToken.algorithm
  };
  return import_jsonwebtoken2.default.sign(payload, jwtConfigRefershToken.secret_key, options);
}
function verifyAccessToken(token) {
  try {
    return import_jsonwebtoken2.default.verify(token, jwtConfigAccessToken.secret_key);
  } catch (error) {
    return null;
  }
}
var import_jsonwebtoken2;
var init_jwt2 = __esm({
  "app/auth/src/utils/jwt.ts"() {
    "use strict";
    import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
    init_jwt();
  }
});

// app/auth/src/main.ts
var import_express2 = __toESM(require("express"));
var import_cookie_parser = __toESM(require("cookie-parser"));

// app/auth/src/routes/auth.ts
var import_express = require("express");

// app/auth/src/controllers/auth.controller.ts
init_env();
var import_google_auth_library = require("google-auth-library");
var import_crypto2 = __toESM(require("crypto"));

// libs/typescript/src/types/notificationBuilder.ts
var NotificationBuilder = class {
  constructor() {
    this.message = {};
  }
  setToEmail(email) {
    this.message.toEmail = email;
    return this;
  }
  setType(type) {
    this.message.type = type;
    return this;
  }
  setToPhone(phone) {
    this.message.toPhone = phone;
    return this;
  }
  setSubject(subject) {
    this.message.subject = subject;
    return this;
  }
  setContent(content) {
    this.message.content = content;
    return this;
  }
  addCc(email) {
    if (!this.message.cc) {
      this.message.cc = [];
    }
    this.message.cc.push(email);
    return this;
  }
  fromJSON(data) {
    const rawData = data.message ? data.message : data;
    Object.assign(this.message, rawData);
    return this;
  }
  build() {
    if (!this.message.toEmail && !this.message.toPhone) {
      throw new Error("Cannot build notification: No destination (email or phone) provided.");
    }
    return this.message;
  }
};

// libs/typescript/src/utils/ApiError.ts
var ApiError = class {
  constructor(message = "Something went wrong", errors = {}) {
    this.success = false;
    this.message = message;
    this.errors = errors;
  }
};

// libs/typescript/src/utils/ApiResponse.ts
var ApiResponse = class {
  constructor(message = "Success Fully Get The Output", data = {}) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
};

// libs/typescript/src/utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
async function verifiyingRefeshToken(token, key) {
  try {
    const decoded = import_jsonwebtoken.default.verify(token, key);
    return decoded;
  } catch (err) {
    return err;
  }
}

// libs/typescript/src/tools/clients/queue/rabbitMq/connection.ts
var import_amqplib = __toESM(require("amqplib"));
var RabbitMQClient = class {
  constructor(api_key) {
    this.connection = null;
    this.channel = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.reconnecting = false;
    this.MAX_RECONNECT_ATTEMPTS = 10;
    this.RECONNECT_DELAY_MS = 5e3;
    this.api_key = null;
    this.api_key = api_key;
  }
  async connect() {
    if (this.connected && this.channel) return;
    try {
      console.log(`Connecting to RabbitMQ... (Attempt ${this.reconnectAttempts + 1})`);
      if (!this.api_key) {
        throw new Error("FATAL: QUEUE URL is undefined. Check .env.dev loading.");
      }
      this.connection = await import_amqplib.default.connect(this.api_key);
      this.channel = await this.connection.createChannel();
      this.connected = true;
      this.reconnecting = false;
      this.reconnectAttempts = 0;
      console.log("Queue Connected Successfully");
      this.connection.on("error", (err) => {
        console.error("Queue Connection Error:", err.message);
        this.handleDisconnect();
      });
      this.connection.on("close", () => {
        console.warn("Queue Connection Closed. Triggering reconnect...");
        this.handleDisconnect();
      });
      this.channel.on("error", (err) => {
        console.error("Queue Channel Error:", err.message);
        this.handleDisconnect();
      });
      this.channel.on("close", () => {
        console.warn("Queue Channel Closed. Triggering reconnect...");
        this.handleDisconnect();
      });
      return this;
    } catch (error) {
      console.error("Queue Connection Failed:", error.message);
      this.connected = false;
      this.channel = null;
      this.connection = null;
      await this.scheduleReconnect();
      return this;
    }
  }
  handleDisconnect() {
    if (this.reconnecting) return;
    this.connected = false;
    this.channel = null;
    this.connection = null;
    this.reconnecting = true;
    this.scheduleReconnect();
  }
  async scheduleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error(`Max reconnect attempts (${this.MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
      this.reconnecting = false;
      return;
    }
    this.reconnectAttempts++;
    const delay = this.RECONNECT_DELAY_MS * this.reconnectAttempts;
    console.log(`Reconnecting in ${delay / 1e3}s... (Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await this.connect();
  }
  async getChannel() {
    if (this.reconnecting) {
      console.log("Waiting for RabbitMQ reconnection...");
      await this.waitForReconnection();
    }
    if (!this.channel || !this.connected) {
      await this.connect();
    }
    return this.channel;
  }
  // Polls until reconnection is done or channel is available
  waitForReconnection() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.connected && this.channel) {
          clearInterval(interval);
          resolve();
        } else if (!this.reconnecting && (!this.connected || !this.channel)) {
          clearInterval(interval);
          reject(new ApiError("RabbitMQ is unavailable after reconnection attempts", new Error("Reconnection failed")));
        }
      }, 500);
    });
  }
};

// libs/typescript/src/tools/clients/queue/rabbitMq/producer.ts
var RabbitMQProducer = class {
  constructor(client2) {
    this.client = client2;
  }
  async publish(exchange, routingKey, data) {
    try {
      const channel = await this.client.getChannel();
      await channel.assertExchange(exchange, "direct", { durable: true });
      const jsonString = JSON.stringify(data);
      const bufferData = Buffer.from(jsonString);
      channel.publish(
        exchange,
        routingKey,
        bufferData,
        { persistent: true }
        // Ensure message survives broker restarts
      );
      console.log(`[RabbitMQProducer] Successfully published message to exchange '${exchange}' with routing key '${routingKey}'`);
    } catch (err) {
      console.error("[RabbitMQProducer] Error publishing message:", err);
      throw err;
    }
  }
};

// app/auth/src/rabbitmq/client.ts
init_env();
var rabbitMqString = String(QUEUE_URL);
var appRabbitMQ = new RabbitMQClient(rabbitMqString);

// app/auth/src/rabbitmq/producers/email-producer.ts
init_env();
var EmailProducer = class {
  constructor() {
    this.producer = new RabbitMQProducer(appRabbitMQ);
  }
  async send(data) {
    try {
      console.log(data);
      console.log("From the producer");
      const exchange = QUEUE_EXCHANGE;
      const routingKey = QUEUE_ROUTING_EMAIL;
      await this.producer.publish(exchange, routingKey, data);
      console.log(`OTP Sent via Queue`);
    } catch (err) {
      console.error("Producer Error:", err);
      throw err;
    }
  }
};
var emailProducer = new EmailProducer();

// app/auth/src/lib/database.ts
var import_serverless = require("@neondatabase/serverless");
var import_adapter_neon = require("@prisma/adapter-neon");
var import_client2 = require("@prisma/client");
var import_ws = __toESM(require("ws"));
init_env();
import_serverless.neonConfig.webSocketConstructor = import_ws.default;
var globalForPrisma = globalThis;
function createNeonAdapter() {
  const connectionUrl = DATABASE_URL_PRODUCTION || DATABASE_URL;
  if (!connectionUrl) {
    throw new Error('Missing required environment variable: "DATABASE_URL_PRODUCTION" or "DATABASE_URL"');
  }
  return new import_adapter_neon.PrismaNeon({ connectionString: connectionUrl });
}
var Database = class {
  static {
    this.instance = null;
  }
  static getClient() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new import_client2.PrismaClient({ adapter: createNeonAdapter() });
    return this.instance;
  }
};
var database = globalForPrisma.prisma || Database.getClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

// app/auth/src/repositories/user.db.ts
var User = class {
  constructor(database2) {
    this.db = database2;
  }
  // checking wheather the user is already present or not in the db
  async checkingUserPresent(email) {
    try {
      const allInformation = await this.db.user.findUnique({
        where: {
          email
        }
      });
      return allInformation;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  // creating the user with not verified status , it means right now user is not verified
  async creatingUser(details) {
    const { name, email, password, type } = details;
    try {
      const crypto2 = require("crypto");
      await this.db.user.create({
        data: {
          name,
          email,
          password,
          is_verified: false,
          type,
          refresh_token: crypto2.randomUUID()
        }
      });
    } catch (err) {
      throw err;
    }
  }
  // for changing the is_verified status to be true
  async changingIsVerifiedStatus(email) {
    try {
      await this.db.user.update({
        where: {
          email
        },
        data: {
          is_verified: true
        }
      });
    } catch (err) {
      throw err;
    }
  }
  // updating the access token in the table
  async updateRefershToken(email, refresh_token) {
    try {
      await this.db.user.update({
        where: {
          email
        },
        data: {
          refresh_token
        }
      });
    } catch (err) {
      throw err;
    }
  }
  // updating the password in the table using the userid
  async updatePassword(user_id, password) {
    try {
      console.log(`\u{1F50D} REPO: Attempting to update User ID: ${user_id}`);
      const exists = await this.db.user.findUnique({ where: { id: user_id } });
      if (!exists) {
        console.error(
          `REPO ERROR: User ID ${user_id} does not exist in DB!`
        );
        throw new Error(`User ID ${user_id} not found`);
      }
      console.log(`User Found: ${exists.email}. Updating password...`);
      const updated = await this.db.user.update({
        where: { id: user_id },
        data: { password }
      });
      console.log("REPO SUCCESS: Password hash updated in DB.");
      return updated;
    } catch (err) {
      console.error("REPO CRASH: Prisma failed to update:", err.message);
      throw err;
    }
  }
  // for finding the user in the table
  async userDetails(email) {
    try {
      const userDetails3 = await this.db.user.findUnique({
        where: {
          email,
          is_verified: true
        }
      });
      return userDetails3;
    } catch (err) {
      throw err;
    }
  }
  // for finding the user through the id
  async userDetailsThroughId(id) {
    try {
      const userDetails3 = await this.db.user.findUnique({
        where: {
          id
        }
      });
      if (!userDetails3) {
        throw new ApiError("No such type of the user exxists in the table");
      }
      return userDetails3;
    } catch (err) {
      throw err;
    }
  }
};
var user = new User(database);

// app/auth/src/utils/generateOtp.ts
var import_crypto = require("crypto");
function random6digitnumber() {
  const otp = (0, import_crypto.randomInt)(1e5, 999999).toString();
  return otp;
}

// app/auth/src/controllers/auth.controller.ts
init_jwt2();

// app/auth/src/utils/password.ts
var import_bcrypt = __toESM(require("bcrypt"));
init_env();
async function hashPassword(rawPassword) {
  const saltRound = parseInt(SALT_ROUND || "10", 10);
  return await import_bcrypt.default.hash(rawPassword, saltRound);
}
async function comparePasswords(rawPassword, storedHash) {
  return await import_bcrypt.default.compare(rawPassword, storedHash);
}

// app/auth/src/lib/redis.ts
init_env();
var import_redis = require("redis");
var RedisConfig = class {
  constructor() {
    this.redisClient = (0, import_redis.createClient)({
      url: REDIS_URL,
      pingInterval: 1e3 * 60 * 4
      // 4 minutes
    });
    this.redisClient.on(
      "error",
      (err) => console.log("Redis Client Error:", err)
    );
    this.redisClient.on(
      "connect",
      () => console.log("Redis Connected Successfully")
    );
    this.connect();
  }
  async connect() {
    try {
      await this.redisClient.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  }
};
var redisConfig = new RedisConfig();
var redisClient = redisConfig.redisClient;

// app/auth/src/controllers/auth.controller.ts
var AuthController = class {
  constructor(redis) {
    this.createUser = async (req, res) => {
      const { name, email, password, type } = req.body;
      try {
        const hashedPassword = await hashPassword(password);
        const signinPayload = {
          name,
          email,
          password: hashedPassword,
          type
        };
        const checkingUserPresent = await user.checkingUserPresent(email);
        if (checkingUserPresent && checkingUserPresent.is_verified) {
          return res.status(409).json(new ApiError("User already exists"));
        }
        if (!checkingUserPresent) {
          const creatingUser = await user.creatingUser(signinPayload);
        }
        const otp = random6digitnumber();
        const redis_key = `auth:${email}`;
        const otp_expire_time = Number(OTP_EXPIRE_TIME) || 300;
        const payload = new NotificationBuilder().setToEmail(email).setSubject("Verify Account").setType("EMAIL").setContent(
          `Your verification OTP is ${otp} and it will expire after ${otp_expire_time / 60} minutes`
        ).build();
        await emailProducer.send(payload);
        console.log(`Saving OTP to Redis for ${email}...`);
        await this.redis.setEx(redis_key, otp_expire_time, String(otp));
        console.log("Saved to Redis");
        return res.status(200).json(new ApiResponse("OTP is Sent Successfully"));
      } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json(new ApiError("Error in user creation or sending the OTP", err.message || err));
      }
    };
    this.verifySignupOtp = async (req, res) => {
      const { email, otp } = req.body;
      try {
        const key = `auth:${email}`;
        const storedOtp = await redisClient.get(key);
        if (!storedOtp || storedOtp !== String(otp)) {
          return res.status(404).json(new ApiError("OTP is expired or invalid"));
        }
        await this.redis.del(key);
        await user.changingIsVerifiedStatus(email);
        const informationOfUser = await user.checkingUserPresent(email);
        const payload = {
          id: informationOfUser.id,
          email: informationOfUser.email,
          name: informationOfUser.name,
          type: informationOfUser.type
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefershToken(
          { id: informationOfUser.id },
          JWT_TEMP_EXPIRES_IN_REFERSH_TOKEN || "1d"
        );
        await user.updateRefershToken(email, refreshToken);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1e3,
          path: "/"
        });
        return res.status(200).json(
          new ApiResponse("Account verified and logged in successfully", {
            accessToken
          })
        );
      } catch (err) {
        return res.status(500).json(new ApiError("Error in verifying signup OTP", err));
      }
    };
    this.verifyForgotPasswordOtp = async (req, res) => {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json(new ApiError("Email and OTP are required"));
      }
      try {
        const key = `auth:${email}`;
        const storedOtp = await this.redis.get(key);
        if (!storedOtp || storedOtp !== String(otp)) {
          return res.status(400).json(new ApiError("OTP is expired or invalid"));
        }
        await this.redis.del(key);
        const userDetails3 = await user.userDetails(email);
        if (!userDetails3) {
          return res.status(404).json(new ApiError("User account not found"));
        }
        const payload = {
          id: userDetails3.id,
          name: userDetails3.name,
          email: userDetails3.email,
          type: userDetails3.type
        };
        const accessToken = generateAccessToken(payload);
        return res.status(200).json(
          new ApiResponse("Your Password is Changed, Please Login Again", {
            accessToken
          })
        );
      } catch (err) {
        return res.status(500).json(new ApiError("Error verifying forgot password OTP", err));
      }
    };
    this.forgotPasswordVerification = async (req, res) => {
      const { email } = req.body;
      try {
        const userDetails3 = await user.checkingUserPresent(email);
        if (userDetails3) {
          const otp = random6digitnumber();
          const redis_key = `auth:${email}`;
          const otp_expire_time = Number(OTP_EXPIRE_TIME) || 300;
          const payload = new NotificationBuilder().setToEmail(email).setSubject("Forgot Password OTP").setType("EMAIL").setContent(
            `OTP To Reset Password is ${otp}, it will expire after ${otp_expire_time / 60} minutes`
          ).build();
          await emailProducer.send(payload);
          await this.redis.setEx(redis_key, otp_expire_time, String(otp));
        }
        return res.status(200).json(
          new ApiResponse(
            "If an account exists, a code has been sent to your email."
          )
        );
      } catch (err) {
        return res.status(404).json(
          new ApiError("Error in sending the otp for the forgotPassword", err)
        );
      }
    };
    this.forgotPasswordChange = async (req, res) => {
      const { password } = req.body;
      try {
        const accessToken = req.headers["authorization"]?.split(" ")[1];
        let originalUserId = req.user;
        if (accessToken) {
          const { verifyAccessToken: verifyAccessToken2 } = (init_jwt2(), __toCommonJS(jwt_exports));
          const decoded = verifyAccessToken2(accessToken);
          if (decoded && decoded.id) {
            originalUserId = decoded.id;
          }
        }
        const userId = originalUserId;
        console.log(
          "DEBUG: passwordChange: req.userId =",
          req.userId,
          "req.user =",
          req.user,
          "final userId =",
          userId
        );
        const userDetails3 = await user.userDetailsThroughId(userId);
        if (!userDetails3) {
          return res.status(404).json(new ApiError("User not found during password change."));
        }
        const hashedPassword = await hashPassword(password);
        await user.updatePassword(userId, hashedPassword);
        return res.status(200).json(
          new ApiResponse(
            "Password is changed successfully. Please log in again."
          )
        );
      } catch (err) {
        return res.status(404).json(new ApiError("Error in changing the password", err));
      }
    };
    // for loging the User 
    this.login = async (req, res) => {
      const { email, password, remberMe } = req.body;
      try {
        const userdetails = await user.userDetails(email);
        if (!userdetails) {
          return res.status(404).json(new ApiError("No Such user is found out"));
        }
        const valid = await comparePasswords(password, userdetails.password);
        if (!valid) {
          return res.status(404).json(new ApiError("Invalid Password"));
        }
        const userId = userdetails.id;
        const jwtPayloadAccessToken = {
          id: userId,
          name: userdetails.name,
          email: userdetails.email,
          type: userdetails.type
        };
        const jwtPayloadRefershToken = {
          id: userId
        };
        const accessToken = generateAccessToken(jwtPayloadAccessToken);
        var refreshToken;
        if (remberMe) {
          refreshToken = generateRefershToken(jwtPayloadRefershToken, "30d");
        } else {
          refreshToken = generateRefershToken(jwtPayloadRefershToken, JWT_TEMP_EXPIRES_IN_REFERSH_TOKEN || "1d");
        }
        await user.updateRefershToken(email, refreshToken);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1e3,
          path: "/"
        });
        return res.status(200).json(
          new ApiResponse("User is found, and successfully logged in", {
            accessToken
          })
        );
      } catch (err) {
        return res.status(500).json(new ApiError("Error in verifying the user", err));
      }
    };
    this.refershToken = async (req, res) => {
      const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!incomingRefreshToken) {
        return res.status(401).json(new ApiError("Unauthorized. Please login again."));
      }
      try {
        const decoded = await verifiyingRefeshToken(
          incomingRefreshToken,
          JWT_SECRET_REFERSH_TOKEN
        );
        console.log("[REFRESH DEBUG] decoded output:", decoded);
        const userId = decoded.id;
        if (!userId) {
          console.log("[REFRESH DEBUG] Failed because userId is missing from decoded token! decoded =", decoded);
          return res.status(401).json(new ApiError("Refresh Token payload is invalid or expired"));
        }
        const userDetails3 = await user.userDetailsThroughId(userId);
        if (userDetails3.refresh_token != incomingRefreshToken) {
          console.log("[REFRESH DEBUG] Failed because DB refresh_token does not match!");
          return res.status(401).json(new ApiError("Refresh Token is incorrect"));
        }
        const newAccessToken = generateAccessToken({
          id: userId,
          name: userDetails3.name,
          email: userDetails3.email,
          type: userDetails3.type
        });
        return res.status(200).json(
          new ApiResponse("Access token refreshed", {
            accessToken: newAccessToken
          })
        );
      } catch (err) {
        console.log("[REFRESH DEBUG] Caught error:", err);
        res.clearCookie("refreshToken");
        return res.status(401).json(new ApiError("Session expired. Please login again.", err));
      }
    };
    this.googleLogin = async (req, res) => {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json(new ApiError("idToken is required"));
      }
      try {
        const client2 = new import_google_auth_library.OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await client2.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload) {
          return res.status(400).json(new ApiError("Invalid Google token payload"));
        }
        const { email, name, email_verified } = payload;
        if (!email || !email_verified) {
          return res.status(400).json(new ApiError("Google email not verified or missing"));
        }
        let informationOfUser = await user.checkingUserPresent(email);
        if (!informationOfUser) {
          const randomPassword = import_crypto2.default.randomBytes(16).toString("hex");
          const hashedPassword = await hashPassword(randomPassword);
          const signinPayload = {
            name: name || "User",
            email,
            password: hashedPassword,
            type: "User"
          };
          await user.creatingUser(signinPayload);
          await user.changingIsVerifiedStatus(email);
          informationOfUser = await user.checkingUserPresent(email);
        } else if (!informationOfUser.is_verified) {
          await user.changingIsVerifiedStatus(email);
          informationOfUser.is_verified = true;
        }
        if (!informationOfUser) {
          return res.status(500).json(new ApiError("Failed to fetch or create user"));
        }
        const jwtPayload = {
          id: informationOfUser.id,
          email: informationOfUser.email,
          name: informationOfUser.name,
          type: informationOfUser.type
        };
        const accessToken = generateAccessToken(jwtPayload);
        const refreshToken = generateRefershToken(
          { id: informationOfUser.id },
          JWT_TEMP_EXPIRES_IN_REFERSH_TOKEN || "1d"
        );
        await user.updateRefershToken(email, refreshToken);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1e3,
          path: "/"
        });
        return res.status(200).json(
          new ApiResponse("Logged in successfully with Google", {
            accessToken
          })
        );
      } catch (err) {
        console.error("Google Auth Error:", err);
        return res.status(500).json(new ApiError("Error verifying Google Token", err));
      }
    };
    this.logout = async (req, res) => {
      try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (incomingRefreshToken) {
          try {
            const decoded = await verifiyingRefeshToken(
              incomingRefreshToken,
              JWT_SECRET_REFERSH_TOKEN
            );
            if (decoded && decoded.id) {
              const userDetails3 = await user.userDetailsThroughId(decoded.id);
              if (userDetails3) {
                await user.updateRefershToken(userDetails3.email, "");
              }
            }
          } catch (tokenError) {
            console.log("Token invalid/expired during logout process.");
          }
        }
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/"
        });
        return res.status(200).json(new ApiResponse("User logged out successfully"));
      } catch (err) {
        return res.status(500).json(new ApiError("Error occurred during logout", err));
      }
    };
    this.redis = redis;
  }
};
var authController = new AuthController(redisClient);

// app/auth/src/routes/auth.ts
var authRouter = (0, import_express.Router)();
authRouter.post("/signup", authController.createUser);
authRouter.post("/verify-signup", authController.verifySignupOtp);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/google", authController.googleLogin);
authRouter.post("/refresh", authController.refershToken);
authRouter.post("/forgot-password", authController.forgotPasswordVerification);
authRouter.post("/verify-forgot-password", authController.verifyForgotPasswordOtp);
authRouter.post("/reset-password", authController.forgotPasswordChange);

// app/auth/src/middlewares/internalAuth.middleware.ts
init_env();
var internalAuthMiddleware = (req, res, next) => {
  const secretHeader = req.headers["x-internal-secret"];
  if (!secretHeader || secretHeader !== INTERNAL_API_SECRET) {
    console.error(`[Security Warning] Blocked direct access attempt to ${req.path}`);
    return res.status(403).json(new ApiError("Forbidden: Direct access is not allowed. All requests must go through the API Gateway."));
  }
  next();
};

// app/auth/src/main.ts
var host = process.env.HOST ?? "localhost";
var port = process.env.PORT ? Number(process.env.PORT) : 4e3;
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use((0, import_cookie_parser.default)());
app.get("/", (req, res) => {
  res.send({ "message": "Hello API" });
});
app.use("/auth", internalAuthMiddleware, authRouter);
app.get("/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      "Server is running properly"
    )
  );
});
async function startServer() {
  await appRabbitMQ.connect();
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}
startServer();
