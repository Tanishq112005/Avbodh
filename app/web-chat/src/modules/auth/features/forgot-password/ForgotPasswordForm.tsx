'use client';

import { cn } from '@/lib/utils';
import { FieldGroup } from '@/components/ui/field';
import { useForgotPassword } from './useForgotPassword';
import { ForgotPasswordFields } from './ForgotPasswordFields';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useForgotPassword();

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>

        <ForgotPasswordFields form={form} />
      </FieldGroup>
    </form>
  );
}
