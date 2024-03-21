import { VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import { createElement, forwardRef } from "react";
import { Link } from "react-router-dom";

type ButtonProps = VariantProps<typeof buttonClasses> & {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
} & (
    | (Omit<JSX.IntrinsicElements["a"], "onClick" | "href" | "ref"> & {
        type?: never;
      })
    | (Omit<JSX.IntrinsicElements["button"], "ref" | "disabled" | "onClick"> & {
        href?: never;
      })
  );

const buttonClasses = cva(
  "inline-flex items-center rounded-md gap-2  text-md justify-center border border-slate-400 bg-white py-4 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary-color",
        secondary:
          "text-primary bg-white bg-opacity-10 border border-white-08 backdrop-filter-[12px] hover:bg-opacity-20 transition-colors ease-in-out ",
        textiary: "",
      },
      size: {
        small: "text-xs px-3 h-7",
        medium: "text-sm px-4 h-8",
        large: "text-md px-6 h-12",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    prefixIcon,
    suffixIcon,
    loading,
    type = "button",
    variant,
    size,
    ...passThroughProps
  } = props;

  const disabled = loading || props.disabled;
  const elementType = props.href ? "a" : "button";

  const element = createElement(
    elementType,
    {
      ...passThroughProps,
      type: props.href ? undefined : type,
      disabled: disabled,
      ref,
      className: classNames(buttonClasses({ variant, size }), props.className),
      onClick: disabled
        ? (e: React.MouseEvent<HTMLElement, MouseEvent>) => e.preventDefault()
        : props.onClick,
    },
    <>
      {prefixIcon && prefixIcon}
      {loading && (
        <svg
          className={classNames("mx-4 h-5 w-5 animate-spin")}
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {props.children}
      {suffixIcon && suffixIcon}
    </>
  );

  if (props.href) {
    return <Link to={props.href}>{element}</Link>;
  }

  return <>{element}</>;
});
