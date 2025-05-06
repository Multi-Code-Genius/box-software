"use client";

import * as React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function InputOTPForm() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-2 ">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
        className="w-full"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="w-12 mx-1" />
          <InputOTPSlot index={1} className="w-12 mx-1" />
          <InputOTPSlot index={2} className="w-12 mx-1" />
          <InputOTPSlot index={3} className="w-12 mx-1" />
          <InputOTPSlot index={4} className="w-12 mx-1" />
          <InputOTPSlot index={5} className="w-12 mx-1" />
        </InputOTPGroup>
      </InputOTP>

      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
    </div>
  );
}
