"use client";

import { cn } from "@/lib/cn";
import * as React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { className, prefix, suffix, hasError = false, disabled, ...props },
    ref,
  ) {
    return (
      <div
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-[var(--radius-ui)] border bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-1 focus-within:ring-offset-[var(--bg-canvas)]",
          hasError
            ? "border-[var(--danger)] focus-within:ring-[var(--danger)]"
            : "border-[var(--border-subtle)]",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {prefix ? (
          <span className="inline-flex shrink-0 items-center text-[var(--text-muted)]">
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className="h-full w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {suffix ? (
          <span className="inline-flex shrink-0 items-center text-[var(--text-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
    );
  },
);

export interface TextFieldProps extends InputProps {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      helperText,
      error,
      containerClassName,
      required,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="text-xs font-medium tracking-wide text-[var(--text-primary)]"
          >
            {label}
            {required ? (
              <span className="ml-1 text-[var(--danger)]" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <Input
          ref={ref}
          id={inputId}
          required={required}
          hasError={Boolean(error)}
          aria-describedby={describedBy}
          {...inputProps}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-[var(--danger)]">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[var(--text-muted)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
