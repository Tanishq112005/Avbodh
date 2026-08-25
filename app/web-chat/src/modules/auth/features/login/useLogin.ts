import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../../api/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remberMe, setRemberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authService.login({ email, password, remberMe });

      if (data?.data?.accessToken) {
        document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      setUser({ id: '1', name: 'User', email });
      toast.success('Successfully logged in!');
      router.push('/agent');
    } catch (err: any) {
      toast.error(err.message || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    remberMe,
    setRemberMe,
    loading,
    handleSubmit,
  };
}
