'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FieldGroup, Field } from '@/components/ui/field';
import { useSignup } from './useSignup';
import { SignupFields } from './SignupFields';
import { SignupOAuth } from './SignupOAuth';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useSignup();

  return (
    <form
      className={cn('flex flex-col gap-4', className)}
      onSubmit={form.handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        <SignupFields form={form} />

        <Field>
          <Button type="submit" disabled={form.loading}>
            {form.loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Field>

        <SignupOAuth />
      </FieldGroup>
    </form>
  );
}
