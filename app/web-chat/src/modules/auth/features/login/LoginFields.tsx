import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginFields({ form }: { form: any }) {
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
        <div className="flex items-center">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <a
            href="/auth/forgot-password"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
        />
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="remember-me"
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            checked={form.remberMe}
            onChange={(e) => form.setRemberMe(e.target.checked)}
          />
          <label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Remember me
          </label>
        </div>
      </Field>
    </>
  );
}
