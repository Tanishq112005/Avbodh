'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useLogin } from './useLogin';
import { LoginFields } from './LoginFields';
import { LoginOAuth } from './LoginOAuth';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useLogin();

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <LoginFields form={form} />

        <Field>
          <Button type="submit" disabled={form.loading}>
            {form.loading ? 'Logging in...' : 'Login'}
          </Button>
        </Field>

        <LoginOAuth />
      </FieldGroup>
    </form>
  );
}
