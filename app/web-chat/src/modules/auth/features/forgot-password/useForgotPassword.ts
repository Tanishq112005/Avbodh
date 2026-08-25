import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../../api/auth.service';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      toast.success('Reset link sent!');
      router.push(
        `/auth/verify?email=${encodeURIComponent(email)}&type=forgot-password`,
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, handleSubmit };
}
