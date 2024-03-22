import { InputField } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";
import { loginSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginRequestDto, loginWithEmailAndPassword } from "../api/login";
import { Layout } from "./Layout";

type FormValue = {
  password: string;
  email: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("myli", location.state);
  const [loading, setLoading] = useState(false);
  const methods = useForm<FormValue>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValue) => {
    console.log("data payload", data);
    try {
      setLoading(true);
      const payload: LoginRequestDto = {
        password: data.password,
        email: data.email,
      };
      const response = await loginWithEmailAndPassword(payload);
      setLoading(false);
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/app/dashboard");
    } catch (ex) {
      setLoading(false);

      if (ex instanceof AxiosError) {
        if (ex.response?.status === 401) {
          console.log("ex.", ex.response.data?.message);
          toast.error(ex.response.data?.message ?? "Invalid credentials");

          return;
        }
        toast.error(ex.message);
      }
    }
  };

  useEffect(() => {
    if (location.state && location.state.error) {
      toast.error(location.state.error);
    }
  }, []);

  const { register, handleSubmit } = methods;
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
                label="Email address"
                placeholder="Enter email address"
                isFullWidth={true}
                {...register("email")}
                inputMode="email"
                name="email"
              />
            </div>
            <div className="mb-4">
              <InputField
                label="Password"
                placeholder="*******"
                isFullWidth={true}
                type="password"
                {...register("password")}
                name="password"
              />
            </div>

            <Button
              type="submit"
              size="medium"
              loading={loading}
              className="w-full bg-[#000] text-white  p-2 rounded-md my-2"
            >
              Sign in
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
          Sign in with Google
        </Button>

        <Button href="/auth/signup" size="medium" className="border-none">
          Don't have an account? Sign up here.
        </Button>
      </div>
    </Layout>
  );
};
