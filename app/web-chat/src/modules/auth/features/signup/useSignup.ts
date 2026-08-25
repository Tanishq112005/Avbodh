import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../../api/auth.service';

export function useSignup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8)
      return toast.error('Password must be at least 8 characters long.');
    if (password !== confirmPassword)
      return toast.error('Passwords do not match.');

    try {
      setLoading(true);
      await authService.signup({ name, email, password });
      toast.success('Account created successfully!');
      router.push(
        `/auth/verify?email=${encodeURIComponent(email)}&type=signup`,
      );
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  };
}
