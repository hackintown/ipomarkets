"use client"; // If you are using Next.js App Router and need client-side interactivity

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 1) We define our base Tailwind classes and also break down style "variants"
 *    using cva. This helps us keep a consistent API for customizing our Button.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      /**
       * Variant allows you to define different color styles or "themes" for
       * the button (e.g. primary, secondary, outline).
       */
      variant: {
        primary: [
          "bg-primary text-primary-foreground",
          "before:absolute before:inset-0 before:translate-x-[-100%]",
          "before:bg-white/10 before:transition-transform before:duration-300",
          "hover:before:translate-x-0 hover:shadow-lg",
          "active:scale-[0.98]",
          "focus-visible:ring-primary",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground",
          "before:absolute before:inset-0 before:translate-x-[-100%]",
          "before:bg-black/5 before:transition-transform before:duration-300",
          "hover:before:translate-x-0",
          "active:scale-[0.98]",
          "focus-visible:ring-secondary",
        ].join(" "),
        outline: [
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-accent",
          "shadow-sm",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-accent",
        ].join(" "),
        danger: [
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          "focus-visible:ring-destructive",
          "shadow-sm",
        ].join(" "),
        link: "text-primary underline-offset-4 hover:underline",
      },
      /**
       * We define mobile-first sizes and add responsive classes to accommodate
       * different breakpoints.
       */
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-base",
        xl: "h-12 px-6 text-lg",
        icon: "h-9 w-9",
      },
      /**
       * Make the button stretch to 100% width if desired
       */
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    /**
     * Default variant values if the user doesn't specify
     */
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

/**
 * ButtonProps extends the normal button properties + adds our custom
 * "variant" props from cva + optional icons and a loading state.
 */
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * We use React.forwardRef so the parent component can directly reference
 * the underlying <button> DOM element, if needed.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon,
      rightIcon,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          className // Allow any additional classes to be appended
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Spinner for loading state (SVG) */}
        {isLoading && (
          <svg
            className="absolute left-2 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Left icon (only if not loading) */}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}

        {/* Main button text */}
        <span>{children}</span>

        {/* Right icon */}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
