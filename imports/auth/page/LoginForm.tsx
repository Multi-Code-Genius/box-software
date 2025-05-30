"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRequestOtp, useVerifyOtp } from "@/api/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOTP] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const [step, setStep] = useState(0);

  const { mutate, isPending, isSuccess } = useRequestOtp();
  const { mutate: VerifyMutate } = useVerifyOtp();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email or phone is required.");
      return;
    }

    if (!name.trim()) {
      setEmailError("Name is required.");
      return;
    }

    mutate({ phone: email.trim(), name: name.trim() });
    setEmailError("");
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.trim().length < 4) {
      setOtpError("Please enter the 4-digit OTP.");
      return;
    }
    VerifyMutate({ phone: email.toString(), otp: otp });
    setOtpError("");
  };

  useEffect(() => {
    if (isSuccess) {
      setStep(1);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col justify-center h-[100vh] items-center border ">
      {step === 0 ? (
        <div className="border shadow-md p-14 flex flex-col items-center rounded-lg ">
          <h1 className="text-2xl font-bold ">Login</h1>
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col gap-5 py-5 items-center"
          >
            <div>
              <Label className="text-lg pb-2">Name</Label>
              <Input
                type="text"
                placeholder="Enter name"
                className="w-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-lg pb-2">Phone Number</Label>
              <Input
                type="number"
                placeholder="Enter number"
                className="w-100 "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {emailError && (
                <p className="text-sm text-red-500 pt-2">{emailError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-[50%] flex justify-center items-center space-x-2"
            >
              {isPending ? (
                <>
                  <span
                    className="loader spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send OTP</span>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <form
          onSubmit={handleOTPSubmit}
          className="space-y-4 border  shadow-md p-14 flex flex-col items-center rounded-md"
        >
          <h1 className="text-2xl font-bold text-center">Verify</h1>

          <p className="text-base text-center">
            Your code was sent to you via Email
          </p>

          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(val) => {
              setOTP(val);
              if (otp.length === 4) {
                VerifyMutate({ phone: email, otp: otp });
              }
            }}
          >
            <InputOTPGroup className="gap-2">
              {[...Array(4)].map((_, idx) => (
                <InputOTPSlot
                  key={idx}
                  index={idx}
                  className="h-14 w-14 border"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {otpError && (
            <p className="text-sm text-red-500 text-center">{otpError}</p>
          )}

          <div className="text-center text-sm flex flex-col gap-4 items-center">
            <Button type="submit" className="w-[50%]">
              Verify
            </Button>
            <p>
              Didn&apos;t receive code?
              <span className="text-blue-600 underline underline-offset-2">
                Request Again
              </span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
