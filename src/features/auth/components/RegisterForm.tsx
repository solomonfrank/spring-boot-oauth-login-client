import { InputField, PasswordInputField } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";
import { signupSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SignRequestDto, signupWithEmailAndPassword } from "../api/signup";
import { Layout } from "./Layout";

type FormValue = {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<FormValue>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);
      const payload: SignRequestDto = {
        password: data.password,
        email: data.email,
        name: data.name,
        username: "",
      };
      await signupWithEmailAndPassword(payload);
      setLoading(false);

      toast.success("Signed up successfully.");

      navigate("/auth/login");
    } catch (ex) {
      setLoading(false);

      if (ex instanceof AxiosError) {
        if (ex.response?.status === 400) {
          const messageObj = Object.values(ex.response?.data);
          toast.error(messageObj[0] as string);

          return;
        }

        if (ex.response?.status === 409) {
          const messageObj = ex.response?.data;
          toast.error(messageObj.message as string);

          return;
        }
        toast(ex.message);
        console.log("instanceof", ex.message);
      }
    }
  };

  const { handleSubmit, register } = methods;
  return (
    <Layout title="image">
      <div className="flex justify-center flex-col gap-7 items-center w-[50%] mx-auto">
        <FormProvider {...methods}>
          <form className="w-full block" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center text-lg mb-10 font-semibold">
              Welcome to bookme
            </h2>
            <div className="mb-4">
              <InputField
                label="Full name"
                placeholder="e.g John Doe"
                isFullWidth={true}
                {...register("name")}
                inputMode="text"
                name="name"
              />
            </div>
            <div className="mb-4">
              <InputField
                label="Email address"
                placeholder="Enter email address"
                isFullWidth={true}
                {...register("email")}
                inputMode="email"
                name="email"
              />
            </div>
            <div className="mb-4">
              <PasswordInputField
                label="Password"
                placeholder="*******"
                isFullWidth={true}
                {...register("password")}
                name="password"
              />
            </div>

            <div className="mb-4">
              <InputField
                label="Confirm Password"
                placeholder="*******"
                isFullWidth={true}
                type="password"
                {...register("confirmPassword")}
                name="confirmPassword"
              />
            </div>

            <Button
              type="submit"
              size="medium"
              loading={loading}
              className="w-full bg-black text-white  p-2 rounded-md my-2"
            >
              Sign up
            </Button>
          </form>
        </FormProvider>
        <Button
          href={`${
            import.meta.env.VITE_API_BASE_URL
          }/oauth2/authorize/google?redirect_uri=${
            import.meta.env.VITE_OAUTH2_REDIRECT_URI
          }`}
          size="medium"
          className="w-full bg-transparent text-black  p-2 rounded-md my-2"
        >
          Sign up with Google
        </Button>
        <Button href="/auth/login" size="medium" className="border-none">
          Alreay have an account? Login here.
        </Button>
      </div>
    </Layout>
  );
};
