import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import { ApiResponse } from '@avbodh/typescript';
import {
  HOST,
  PORT,
  AUTHSERVICEURL,
  AGENTSERVICEURL,
  INTERNAL_API_SECRET,
} from './config/env';
import { verifyJwtMiddleware } from './middlewares/verifyJwt.middleware';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware';

const app = express();
const port = PORT ? Number(PORT) : 4000;
const host = HOST ?? 'localhost';

// Middleware Setup
app.use(cookieParser());
app.use(globalRateLimiter);

// 1. Health check for the Gateway itself
app.get('/health', (req, res) => {
  res
    .status(200)
    .json(new ApiResponse('Api Gateway is running on port ' + port));
});

// 2. Proxy Route for Auth Service (No JWT required)
app.use(
  '/auth',
  createProxyMiddleware({
    target: AUTHSERVICEURL,
    changeOrigin: true,
  }),
);

// 3. Proxy Route for Python AI Agent (Requires JWT!)
app.use(
  '/agents',
  verifyJwtMiddleware,
  createProxyMiddleware({
    target: AGENTSERVICEURL,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req: any, res) => {
        if (req.user && req.user.id) {
          proxyReq.setHeader('X-User-Id', req.user.id);
        }
        proxyReq.setHeader(
          'X-Internal-Secret',
          INTERNAL_API_SECRET || 'dev-secret',
        );
      },
    },
  }),
);

app.listen(port, host, () => {
  console.log(`[ api-gateway ] listening at http://${host}:${port}`);
});
