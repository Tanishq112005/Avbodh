import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function ResetPasswordFields({ form }: { form: any }) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="password">New Password</FieldLabel>
        <Input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
        />
        <FieldDescription>Must be at least 8 characters long.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <Input
          id="confirm-password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={(e) => form.setConfirmPassword(e.target.value)}
        />
        <FieldDescription>Please confirm your password.</FieldDescription>
      </Field>
    </>
  );
}
