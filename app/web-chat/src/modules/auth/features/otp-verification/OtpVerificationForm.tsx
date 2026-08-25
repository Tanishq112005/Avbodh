'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useOtpVerification } from './useOtpVerification';
import { OtpInputFields } from './OtpInputFields';

export function OtpVerificationForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useOtpVerification();

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Verify your login</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter the verification code we sent to:{' '}
            <span className="font-medium text-foreground">{form.email}</span>.
          </p>
        </div>

        <OtpInputFields form={form} />

        <Field>
          <Button type="submit" className="w-full" disabled={form.loading}>
            {form.loading ? 'Verifying...' : 'Verify'}
          </Button>
          <div className="text-sm text-center text-muted-foreground mt-2">
            Having trouble signing in?{' '}
            <a
              href="#"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact support
            </a>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
