"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function SubmitButton({ children, pendingText = "Please wait…", variant, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending} className="w-full" {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
