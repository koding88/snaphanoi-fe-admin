"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { CountrySelect } from "@/components/shared/country-select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { RequestMyEmailChangeOtpResult } from "@/features/users/types/users-api.types";
import type { UserRecord } from "@/features/users/types/users.types";
import { getFriendlyUsersError } from "@/features/users/utils/users-errors";
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants/countries";
import { notifyError, notifySuccess } from "@/lib/toast";

type ProfileFormProps = {
  user: UserRecord;
  onSubmit: (payload: { name: string; countryCode: string }) => Promise<void>;
  onRequestEmailOtp: (payload: { email: string }) => Promise<{
    message?: string | null;
    data: RequestMyEmailChangeOtpResult;
  }>;
  onVerifyEmailOtp: (payload: { email: string; otp: string }) => Promise<UserRecord>;
};

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

function formatSecondsLabel(totalSeconds: number) {
  if (totalSeconds <= 0) {
    return "now";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0 && seconds > 0) {
    return `${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
}

export function ProfileForm({
  user,
  onSubmit,
  onRequestEmailOtp,
  onVerifyEmailOtp,
}: ProfileFormProps) {
  const initialCountryCode = user.countryCode ?? DEFAULT_COUNTRY_CODE;
  const [values, setValues] = useState({
    name: user.name,
    countryCode: initialCountryCode,
  });
  const [savedProfile, setSavedProfile] = useState({
    name: user.name,
    countryCode: initialCountryCode,
  });
  const [verifiedEmail, setVerifiedEmail] = useState(user.email);
  const [emailDraft, setEmailDraft] = useState(user.email);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpExpiresInSeconds, setOtpExpiresInSeconds] = useState(0);
  const [resendAvailableInSeconds, setResendAvailableInSeconds] = useState(0);

  const profileDirty =
    values.name !== savedProfile.name || values.countryCode !== savedProfile.countryCode;
  const normalizedEmailDraft = emailDraft.trim();
  const hasPendingEmailChange = normalizedEmailDraft !== verifiedEmail;
  const canResendCode =
    normalizedEmailDraft.length > 0 && resendAvailableInSeconds <= 0 && !isRequestingOtp && !isVerifyingOtp;
  const emailStatusText = useMemo(() => {
    if (pendingEmail && pendingEmail === normalizedEmailDraft) {
      return `Verification code sent. Enter the 6-digit code sent to ${pendingEmail}.`;
    }

    if (hasPendingEmailChange) {
      return "New email is not verified yet. Verify it before it becomes your account email.";
    }

    return "This is the email currently tied to your account.";
  }, [hasPendingEmailChange, normalizedEmailDraft, pendingEmail]);

  useEffect(() => {
    if (resendAvailableInSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setResendAvailableInSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resendAvailableInSeconds]);

  useEffect(() => {
    if (otpExpiresInSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setOtpExpiresInSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [otpExpiresInSeconds]);

  function resetOtpState() {
    setPendingEmail(null);
    setOtpDialogOpen(false);
    setOtpValue("");
    setOtpError(null);
    setOtpExpiresInSeconds(0);
    setResendAvailableInSeconds(0);
  }

  function handleOtpDialogOpenChange(open: boolean) {
    setOtpDialogOpen(open);

    if (!open) {
      setOtpValue("");
      setOtpError(null);
    }
  }

  async function sendOtp(email: string) {
    setIsRequestingOtp(true);
    setEmailError(null);
    setOtpError(null);

    try {
      const response = await onRequestEmailOtp({ email });
      setPendingEmail(email);
      setOtpValue("");
      setOtpDialogOpen(true);
      setOtpExpiresInSeconds(response.data.expiresInSeconds);
      setResendAvailableInSeconds(response.data.resendAvailableInSeconds);
      notifySuccess(
        response.message,
        "Verification code sent.",
        `Use the code sent to ${email}.`,
      );
    } catch (submissionError) {
      const resolvedMessage = getFriendlyUsersError(submissionError);
      setEmailError(resolvedMessage);
      notifyError(resolvedMessage);
    } finally {
      setIsRequestingOtp(false);
    }
  }

  async function handleRequestOtp() {
    setEmailError(null);

    if (!normalizedEmailDraft) {
      setEmailError("Email is required.");
      return;
    }

    if (!isValidEmail(normalizedEmailDraft)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (normalizedEmailDraft === verifiedEmail) {
      setEmailError("Use a different email from the one already on your account.");
      return;
    }

    await sendOtp(normalizedEmailDraft);
  }

  async function handleVerifyOtp() {
    const targetEmail = pendingEmail ?? normalizedEmailDraft;
    const normalizedOtp = otpValue.trim();

    setOtpError(null);

    if (!normalizedOtp) {
      setOtpError("Verification code is required.");
      return;
    }

    if (normalizedOtp.length !== 6) {
      setOtpError("Enter the full 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const updatedUser = await onVerifyEmailOtp({
        email: targetEmail,
        otp: normalizedOtp,
      });

      setVerifiedEmail(updatedUser.email);
      setEmailDraft(updatedUser.email);
      setPendingEmail(null);
      setOtpDialogOpen(false);
      setOtpValue("");
      setOtpError(null);
      setOtpExpiresInSeconds(0);
      setResendAvailableInSeconds(0);
      notifySuccess(
        "Email changed successfully",
        "Email changed successfully.",
        "Your profile now reflects the new email immediately.",
      );
    } catch (submissionError) {
      const resolvedMessage = getFriendlyUsersError(submissionError);
      setOtpError(resolvedMessage);
      notifyError(resolvedMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors: { name?: string } = {};

    if (!values.name.trim()) {
      nextFieldErrors.name = "Full name is required.";
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      setSavedProfile(values);
    } catch (submissionError) {
      notifyError(getFriendlyUsersError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <label className="space-y-2 block max-w-xl">
          <span className="text-sm font-medium text-foreground">Full name</span>
          <Input
            value={values.name}
            onChange={(event) => {
              setValues((current) => ({ ...current, name: event.target.value }));
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? <p className="text-sm text-red-600">{fieldErrors.name}</p> : null}
        </label>

        <div className="rounded-[1.5rem] border border-border/80 bg-white/55 p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-sm leading-6 text-muted-foreground">{emailStatusText}</p>
            </div>
            <span className="text-xs font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase">
              {hasPendingEmailChange ? "Pending verification" : "Current email"}
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">New email</span>
              <Input
                type="email"
                value={emailDraft}
                onChange={(event) => {
                  const nextEmail = event.target.value;

                  setEmailDraft(nextEmail);
                  setEmailError(null);
                  setOtpError(null);

                  if (pendingEmail && nextEmail.trim() !== pendingEmail) {
                    resetOtpState();
                  }
                }}
                aria-invalid={Boolean(emailError)}
              />
              {emailError ? <p className="text-sm text-red-600">{emailError}</p> : null}
            </label>

            <div className="flex flex-col gap-2 md:pt-7">
              <Button
                type="button"
                size="lg"
                className="min-w-44 rounded-full"
                disabled={!hasPendingEmailChange || isRequestingOtp || isVerifyingOtp}
                onClick={() => {
                  if (pendingEmail === normalizedEmailDraft) {
                    setOtpDialogOpen(true);
                    return;
                  }

                  void handleRequestOtp();
                }}
              >
                {isRequestingOtp
                  ? "Sending code..."
                  : pendingEmail === normalizedEmailDraft
                    ? "Enter code"
                    : "Verify new email"}
              </Button>
              {resendAvailableInSeconds > 0 && pendingEmail === normalizedEmailDraft ? (
                <p className="text-xs text-muted-foreground">
                  You can request another code in {formatSecondsLabel(resendAvailableInSeconds)}.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <label className="space-y-2 block max-w-xs">
          <span className="text-sm font-medium text-foreground">Country</span>
          <CountrySelect
            value={values.countryCode}
            onChange={(countryCode) => setValues((current) => ({ ...current, countryCode }))}
          />
        </label>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className="min-w-44 rounded-full"
            disabled={isSubmitting || !profileDirty}
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>

      <AlertDialog open={otpDialogOpen} onOpenChange={handleOtpDialogOpenChange}>
        <AlertDialogContent size="default" className="max-w-md gap-5 rounded-[1.5rem] p-5 sm:max-w-md">
          <AlertDialogHeader className="items-start text-left">
            <AlertDialogTitle>Verify your new email</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Enter the 6-digit code sent to <span className="font-medium text-foreground">{pendingEmail ?? normalizedEmailDraft}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Verification code</span>
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                  setOtpValue(value);
                  setOtpError(null);
                }}
                aria-invalid={Boolean(otpError)}
                containerClassName="justify-start"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="size-11 text-base" />
                  <InputOTPSlot index={1} className="size-11 text-base" />
                  <InputOTPSlot index={2} className="size-11 text-base" />
                  <InputOTPSlot index={3} className="size-11 text-base" />
                  <InputOTPSlot index={4} className="size-11 text-base" />
                  <InputOTPSlot index={5} className="size-11 text-base" />
                </InputOTPGroup>
              </InputOTP>
              {otpError ? <p className="text-sm text-red-600">{otpError}</p> : null}
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                {otpExpiresInSeconds > 0
                  ? `This code expires in ${formatSecondsLabel(otpExpiresInSeconds)}.`
                  : "This verification code may have expired. Request a new one if needed."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto rounded-full px-0 text-sm"
                  disabled={!canResendCode}
                  onClick={() => void sendOtp(pendingEmail ?? normalizedEmailDraft)}
                >
                  {isRequestingOtp
                    ? "Sending new code..."
                    : resendAvailableInSeconds > 0
                      ? `Resend available in ${formatSecondsLabel(resendAvailableInSeconds)}`
                      : "Resend code"}
                </Button>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel disabled={isVerifyingOtp}>Cancel</AlertDialogCancel>
            <Button type="button" disabled={isVerifyingOtp} onClick={() => void handleVerifyOtp()}>
              {isVerifyingOtp ? "Verifying..." : "Verify email"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
