import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function SignupFields({ form }: { form: any }) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          required
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
        />
      </Field>
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
        <FieldLabel htmlFor="password">Password</FieldLabel>
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
