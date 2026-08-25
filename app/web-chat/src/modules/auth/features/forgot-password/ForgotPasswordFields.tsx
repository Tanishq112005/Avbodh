import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ForgotPasswordFields({ form }: { form: any }) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={form.email}
          onChange={(e) => form.setEmail(e.target.value)}
        />
      </Field>

      <Field>
        <Button type="submit" disabled={form.loading}>
          {form.loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </Field>

      <Field>
        <FieldDescription className="text-center">
          Remember your password?{' '}
          <a href="/auth/login" className="underline underline-offset-4">
            Back to Login
          </a>
        </FieldDescription>
      </Field>
    </>
  );
}
