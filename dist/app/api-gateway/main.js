"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// app/api-gateway/src/main.ts
var import_express = __toESM(require("express"));
var import_http_proxy_middleware = require("http-proxy-middleware");
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_cors = __toESM(require("cors"));

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

// libs/typescript/src/tools/clients/queue/rabbitMq/connection.ts
var import_amqplib = __toESM(require("amqplib"));

// app/api-gateway/src/config/env.ts
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
process.env.DOTENV_QUIET = "true";
var envPaths = [
  import_path.default.join(process.cwd(), ".env"),
  import_path.default.join(process.cwd(), "app/api-gateway/.env")
];
for (const p of envPaths) {
  if (import_fs.default.existsSync(p)) {
    import_dotenv.default.config({ path: p });
    break;
  }
}
var {
  PORT,
  AUTHSERVICEURL,
  AGENTSERVICEURL,
  HOST,
  INTERNAL_API_SECRET,
  JWT_SECERTS
} = process.env;

// app/api-gateway/src/middlewares/verifyJwt.middleware.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var verifyJwtMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json(new ApiError("Unauthorized: No token provided"));
    return;
  }
  const token = authHeader.split(" ")[1];
  const secret = JWT_SECERTS || "super-secret-default-key";
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        const refreshToken = req.headers["x-refresh-token"] || req.cookies?.refreshToken;
        if (!refreshToken) {
          res.status(401).json(
            new ApiError(
              "Unauthorized: Token expired. No refresh token provided."
            )
          );
          return;
        }
        const authServiceUrl = `${AUTHSERVICEURL}/refresh`;
        const refreshResponse = await fetch(authServiceUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Secret": INTERNAL_API_SECRET || "dev-secret"
          },
          body: JSON.stringify({ refreshToken })
        });
        if (!refreshResponse.ok) {
          const errorText = await refreshResponse.text();
          console.error(`[GATEWAY DEBUG] Auth service rejected refresh token! Status: ${refreshResponse.status}, Response:`, errorText);
          res.status(401).json(
            new ApiError(
              "Unauthorized: Refresh token failed. Please login again."
            )
          );
          return;
        }
        const data = await refreshResponse.json();
        const newAccessToken = data.data ? data.data.accessToken : data.accessToken;
        const newDecoded = import_jsonwebtoken2.default.verify(newAccessToken, secret);
        req.user = newDecoded;
        res.setHeader("x-new-access-token", newAccessToken);
        req.headers.authorization = `Bearer ${newAccessToken}`;
        next();
      } catch (refreshErr) {
        res.status(401).json(
          new ApiError(
            "Unauthorized: Could not reach auth service to refresh token"
          )
        );
        return;
      }
    } else {
      res.status(401).json(new ApiError("Unauthorized: Invalid token"));
      return;
    }
  }
};

// app/api-gateway/src/middlewares/rateLimiter.middleware.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var globalRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." }
});

// app/api-gateway/src/main.ts
console.log("---- API GATEWAY STARTING ----");
var app = (0, import_express.default)();
var port = PORT ? Number(PORT) : 3e3;
var host = HOST ?? "localhost";
app.use((0, import_cors.default)({
  origin: ["http://localhost:4200", "http://localhost:3000"],
  // Add your frontend origins here
  credentials: true
}));
app.use((0, import_cookie_parser.default)());
app.use(globalRateLimiter);
app.get("/health", (req, res) => {
  res.status(200).json(new ApiResponse("Api Gateway is running on port " + port));
});
app.use(
  (0, import_http_proxy_middleware.createProxyMiddleware)({
    pathFilter: "/auth",
    target: AUTHSERVICEURL,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader(
          "X-Internal-Secret",
          INTERNAL_API_SECRET || "dev-secret"
        );
      }
    }
  })
);
app.use(
  "/chat",
  // We'll keep this for the JWT middleware specifically
  verifyJwtMiddleware,
  (req, res, next) => {
    req.url = req.originalUrl;
    next();
  },
  (0, import_http_proxy_middleware.createProxyMiddleware)({
    target: AGENTSERVICEURL,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id) {
          proxyReq.setHeader("X-User-Id", req.user.id);
        }
        proxyReq.setHeader(
          "X-Internal-Secret",
          INTERNAL_API_SECRET || "dev-secret"
        );
      }
    }
  })
);
app.listen(port, host, () => {
  console.log(`[ api-gateway ] listening at http://${host}:${port}`);
});
