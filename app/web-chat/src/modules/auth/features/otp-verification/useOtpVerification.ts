import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../../api/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

export function useOtpVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || 'your email address';
  const type = searchParams.get('type') || 'signup';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter all 6 digits.');

    try {
      setLoading(true);
      if (type === 'signup') {
        await authService.verifySignupOtp({ email, otp });
        setUser({ id: '1', name: 'User', email });
        router.push('/agent');
      } else {
        const result = await authService.verifyForgotPasswordOtp({
          email,
          otp,
        });
        toast.success('OTP verified!');
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(email)}&token=${result.data?.accessToken || ''}`,
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      if (type === 'signup')
        await authService.signup({
          name: 'User',
          email,
          password: 'DummyPassword123!',
        });
      else await authService.forgotPassword({ email });
      toast.success('A new verification code has been sent!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return { email, otp, setOtp, loading, handleSubmit, handleResend };
}
