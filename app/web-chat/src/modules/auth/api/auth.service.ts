const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/auth';

export const authService = {
  async signup(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...data, type: 'User' }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to sign up');
    }
    
    return result;
  },

  async verifySignupOtp(data: { email: string; otp: string }) {
    const response = await fetch(`${API_URL}/verify-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to verify OTP');
    }
    
    return result;
  },

  async verifyForgotPasswordOtp(data: { email: string; otp: string }) {
    const response = await fetch(`${API_URL}/verify-forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to verify OTP');
    }
    
    return result;
  },

  async login(data: { email: string; password: string; remberMe: boolean }) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to log in');
    }
    
    return result;
  },

  async forgotPassword(data: { email: string }) {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to send reset email');
    }
    
    return result;
  },

  async resetPassword(data: { password: string }, token: string) {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to reset password');
    }
    
    return result;
  }
};
