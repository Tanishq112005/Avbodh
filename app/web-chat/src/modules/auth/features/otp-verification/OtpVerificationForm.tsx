"use client";

import { RefreshCwIcon } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { authService } from "../../api/auth.service"
import { useAuthStore } from "../../store/useAuthStore"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function OtpVerificationForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || "your email address"
  const type = searchParams.get("type") || "signup"
  
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits.")
      return
    }

    try {
      setLoading(true)
      if (type === "signup") {
        const data = await authService.verifySignupOtp({ email, otp })
        // Set user as authenticated (using empty user for now, or decode token)
        setUser({ id: "1", name: "User", email: email }) 
        router.push("/chat")
      } else {
        const result = await authService.verifyForgotPasswordOtp({ email, otp })
        const token = result.data?.accessToken
        toast.success("OTP verified!")
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&token=${token || ''}`)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify code.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setLoading(true)
      if (type === "signup") {
        // We pass dummy values for name/password since backend only needs email for an existing unverified user to resend OTP
        await authService.signup({ name: "User", email, password: "DummyPassword123!" })
      } else {
        await authService.forgotPassword({ email })
      }
      toast.success("A new verification code has been sent!")
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Verify your login</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter the verification code we sent to:{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
        
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">
              Verification code
            </FieldLabel>
            <Button variant="outline" size="sm" className="h-8" type="button" onClick={handleResend} disabled={loading}>
              <RefreshCwIcon className="mr-2 h-3.5 w-3.5" />
              Resend Code
            </Button>
          </div>
          
          <div className="flex justify-center py-2">
            <InputOTP maxLength={6} id="otp-verification" required value={otp} onChange={(value) => setOtp(value)}>
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
            <a href="/auth/signup" className="underline underline-offset-4">I no longer have access to this email address.</a>
          </FieldDescription>
        </Field>
        
        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <div className="text-sm text-center text-muted-foreground mt-2">
            Having trouble signing in?{" "}
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
  )
}
