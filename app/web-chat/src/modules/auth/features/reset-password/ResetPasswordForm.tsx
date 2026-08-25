'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useResetPassword } from './useResetPassword';
import { ResetPasswordFields } from './ResetPasswordFields';

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useResetPassword();

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        <ResetPasswordFields form={form} />

        <Field>
          <Button type="submit" className="w-full" disabled={form.loading}>
            {form.loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
