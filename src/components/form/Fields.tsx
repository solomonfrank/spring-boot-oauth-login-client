import classNames from "classnames";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";

type InputProps = {
  isFullWidth?: boolean;
  name: string;
} & Omit<JSX.IntrinsicElements["input"], "name">;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        "placeholder:text-sm mt-0 text-md  w-full block py-2 px-3  rounded outline-none  focus:outline-none ",
        props.className
      )}
    />
  );
});

type AddonProps = {
  children: React.ReactNode;
  isFilled?: boolean;
  className?: string;
  error?: boolean;
};

const Addon = ({ children, className }: AddonProps) => (
  <div
    className={classNames(
      "flex items-center px-2  border-slate-300 py-3 min-h-9 ",
      className
    )}
  >
    <span className="flex whitespace-nowrap items-center">{children}</span>
  </div>
);

type InputFieldProps = {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
} & React.ComponentProps<typeof Input> & {
    labelProps?: React.ComponentProps<typeof Label>;
  };

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(props, ref) {
    const {
      isFullWidth,
      label,
      labelProps,
      prefixIcon,
      suffixIcon,
      ...otherProps
    } = props;
    const methods = useFormContext();
    return (
      <div className={classNames("w-full")}>
        {label && <Label {...labelProps}>{label}</Label>}

        {prefixIcon || suffixIcon ? (
          <div className="border transition-all mt-1 border-slate-300 group  focus-within:ring-slate-900 flex  items-center justify-center rounded-md focus-within:outline-none focus-within:ring-2">
            {prefixIcon && (
              <Addon className={classNames("border-r-2")}>{prefixIcon}</Addon>
            )}
            <Input isFullWidth={isFullWidth} {...otherProps} ref={ref} />
            {suffixIcon && (
              <Addon className={classNames("border-l-2")}>{suffixIcon}</Addon>
            )}
          </div>
        ) : (
          <div className="border border-slate-300 group mt-1  focus-within:ring-slate-900 flex items-center justify-center rounded-md focus-within:outline-none focus-within:ring-2">
            <Input isFullWidth={isFullWidth} {...otherProps} ref={ref} />
          </div>
        )}

        {methods?.formState?.errors[props.name]?.message && (
          <ErrorMessage fieldName={props.name} />
        )}
      </div>
    );
  }
);

export const Label = (props: JSX.IntrinsicElements["label"]) => {
  return (
    <label
      {...props}
      className={classNames("block text-sm font-medium", props.className)}
    >
      {props.children}
    </label>
  );
};

type ErrorMessageProps = {
  fieldName: string;
};

export const ErrorMessage = ({ fieldName }: ErrorMessageProps) => {
  const method = useFormContext();

  if (!method) return null;
  const { formState } = method;

  const error = formState.errors[fieldName];

  if (error?.message) {
    return (
      <div className="text-red-900 flex space-x-1 text-center text-sm mt-1">
        <span className="flex items-center">
          <BiError />
        </span>
        <span>{error?.message as string}</span>
      </div>
    );
  }

  if (error && !error?.message) {
    {
      return Object.keys(error).map((rule, idx) => {
        const ruleObj = error[rule as keyof typeof error] as {
          message: string;
        };

        return (
          <div
            key={idx}
            className="text-red-900 flex space-x-1 text-center text-sm mt-1"
          >
            <span className="flex items-center">
              <BiError />
            </span>
            <span>{ruleObj?.message ?? ""}</span>
          </div>
        );
      });
    }
  }
};

export const PasswordInputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function PasswordInputField(props, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <InputField
        type={visible ? "text" : "password"}
        inputMode="email"
        autoCorrect="off"
        autoCapitalize="none"
        {...props}
        ref={ref}
        suffixIcon={
          visible ? (
            <button type="button" onClick={() => setVisible(false)}>
              <FiEye size={14} />
            </button>
          ) : (
            <button type="button" onClick={() => setVisible(true)}>
              <FiEyeOff size={14} />
            </button>
          )
        }
      />
    );
  }
);
