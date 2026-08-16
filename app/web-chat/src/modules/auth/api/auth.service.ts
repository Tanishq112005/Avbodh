const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/auth';

export const authService = {
  async signup(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, type: 'USER' }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to sign up');
    }
    
    return result;
  }
};
