import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../../api/auth.service';

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token)
      return toast.error('Missing reset token. Please request a new link.');
    if (password.length < 8)
      return toast.error('Password must be at least 8 characters long.');
    if (password !== confirmPassword)
      return toast.error('Passwords do not match.');

    try {
      setLoading(true);
      await authService.resetPassword({ password }, token);
      toast.success('Password reset successfully!');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  };
}
