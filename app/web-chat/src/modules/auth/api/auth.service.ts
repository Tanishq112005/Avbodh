import { fetchApi } from './auth.config';

export const authService = {
  signup: (data: any) =>
    fetchApi('/signup', {
      method: 'POST',
      body: JSON.stringify({ ...data, type: 'User' }),
    }),

  verifySignupOtp: (data: any) =>
    fetchApi('/verify-signup', { method: 'POST', body: JSON.stringify(data) }),

  verifyForgotPasswordOtp: (data: any) =>
    fetchApi('/verify-forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    fetchApi('/login', { method: 'POST', body: JSON.stringify(data) }),

  forgotPassword: (data: any) =>
    fetchApi('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: any, token: string) =>
    fetchApi('/reset-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
};
