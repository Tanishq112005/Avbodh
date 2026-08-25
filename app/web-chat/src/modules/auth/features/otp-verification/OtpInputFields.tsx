import { RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export function OtpInputFields({ form }: { form: any }) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          type="button"
          onClick={form.handleResend}
          disabled={form.loading}
        >
          <RefreshCwIcon className="mr-2 h-3.5 w-3.5" />
          Resend Code
        </Button>
      </div>

      <div className="flex justify-center py-2">
        <InputOTP
          maxLength={6}
          id="otp-verification"
          required
          value={form.otp}
          onChange={(value) => form.setOtp(value)}
        >
          <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator className="mx-2" />
          <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <FieldDescription className="text-center mt-2">
        <a href="/auth/signup" className="underline underline-offset-4">
          I no longer have access to this email address.
        </a>
      </FieldDescription>
    </Field>
  );
}
