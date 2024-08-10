import { InputField } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";
import { createEventSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import classNames from "classnames";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import ReactSelect from "react-select";
import { createEventHandler } from "../api/createEvent";
import { CredentialResponseType } from "../routes";

type CreateEventFormProps = {
  onClose: () => void;
  reload: () => void;
  locations: CredentialResponseType[];
};

export type LocationOption = {
  label: string;
  value: string;
};

export type FormValue = {
  title: string;
  duration: number;
  description: string;
  price: string;
  location: LocationOption;
};
export const CreateEventForm = ({
  onClose,
  reload,
  locations,
}: CreateEventFormProps) => {
  const [loading, setLoading] = useState(false);
  const methods = useForm<FormValue>({
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
  });

  const { register, handleSubmit } = methods;

  const onSubmit = async (data: FormValue) => {
    try {
      //  setLoading(true);

      const payload = {
        description: data?.description,
        title: data?.title,
        location: data.location ? data.location.value : "",
        price: data?.price?.replace(/[,NGN\s]/g, "") ?? 0,
        duration: String(data.duration),
      };

      const response = await createEventHandler(payload);

      console.log("response", response);

      setLoading(false);

      toast.success("Event created successfully");

      methods.reset();

      reload();
      onClose();
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
        toast.error(ex.message);
      }
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <InputField
            label="Title"
            placeholder="Enter event title"
            isFullWidth={true}
            {...register("title")}
            inputMode="text"
            name="title"
          />
        </div>

        <div className="mb-4">
          <InputField
            label="Description"
            placeholder="Enter event description"
            isFullWidth={true}
            {...register("description")}
            inputMode="text"
            name="description"
          />
        </div>

        <div className="mb-4">
          <InputField
            label="Duration"
            placeholder="10"
            isFullWidth={true}
            {...register("duration")}
            inputMode="numeric"
            name="duration"
            type="number"
          />
        </div>

        <div className="mb-4">
          <Controller
            name="price"
            control={methods.control}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  <label>Price</label>
                  <NumericFormat
                    thousandSeparator
                    prefix="NGN "
                    value={value}
                    allowLeadingZeros={true}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name="price"
                    className="w-full rounded-md placeholder:text-sm mt-0 text-md  block py-2 px-3 focus-within:outline-none  border border-slate-300 focus-within:ring-2 focus-within:ring-slate-900"
                  />
                </>
              );
            }}
          />
        </div>

        <div className="mb-4">
          <label>Location</label>

          {locations.length > 0 ? (
            <Controller
              name="location"
              control={methods.control}
              render={({ field: { value, onChange } }) => {
                return (
                  <ReactSelect
                    // name="location"
                    // isLoading={true}
                    // isDisabled={true}
                    name="location"
                    isMulti={false}
                    options={
                      locations?.map((item) => ({
                        label: item.name,
                        value: String(item.id),
                      })) || []
                    }
                    value={value}
                    classNames={{
                      control: () => classNames("shadow-md"),
                      valueContainer: () => classNames(""),
                      menuList: () => classNames(""),
                    }}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    //  styles={customStyles}
                  />
                );
              }}
            />
          ) : (
            <div>
              <div className="flex gap-3 items-center border rounded-md">
                <span>
                  <GoogleMeetingLogo />
                </span>
                <div>
                  <h3>Google Meet</h3>
                  <p>
                    Connect google meet for video conference.{" "}
                    <a
                      href={`${
                        import.meta.env.VITE_API_BASE_URL
                      }/api/apps/google`}
                      className="border-none text-blue-600 underline text-md"
                    >
                      click
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            className="text-white bg-[#001529]"
          >
            Submit
          </Button>

          {/* <Button
            href={`${import.meta.env.VITE_API_BASE_URL}/api/apps/google`}
            size="medium"
            className="w-full bg-transparent text-black  p-2 rounded-md my-2"
          >
            Sign in with Google
          </Button> */}
        </div>
      </form>
    </FormProvider>
  );
};

const GoogleMeetingLogo = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google Meet"
      role="img"
      viewBox="0 0 512 512"
      height="50"
      width="50"
      {...props}
    >
      <rect width="512" height="512" rx="15%" fill="#ffffff" />
      <path d="M166 106v90h-90" fill="#ea4335" />
      <path d="M166 106v90h120v62l90-73v-49q0-30-30-30" fill="#ffba00" />
      <path d="M164 406v-90h122v-60l90 71v49q0 30-30 30" fill="#00ac47" />
      <path d="M286 256l90-73v146" fill="#00832d" />
      <path
        d="M376 183l42-34c9-7 18-7 18 7v200c0 14-9 14-18 7l-42-34"
        fill="#00ac47"
      />
      <path d="M76 314v62q0 30 30 30h60v-92" fill="#0066da" />
      <path d="M76 196h90v120h-90" fill="#2684fc" />
    </svg>
  );
};
