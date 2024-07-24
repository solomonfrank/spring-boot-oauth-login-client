import { InputField } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";
import { createEventSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { createEventHandler } from "../api/createEvent";

type CreateEventFormProps = {
  onClose: () => void;
  reload: () => void;
};

export type FormValue = {
  title: string;
  duration: number;
  description: string;
  price: string;
};
export const CreateEventForm = ({ onClose, reload }: CreateEventFormProps) => {
  const [loading, setLoading] = useState(false);
  const methods = useForm<FormValue>({
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
  });

  const { register, handleSubmit } = methods;

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        price: data.price.replace(/[,NGN\s]/g, ""),
      };

      console.log("daaaa", payload);

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
            rules={{
              required: "Fraud indicator is required.",
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  <label>Name</label>
                  <NumericFormat
                    thousandSeparator
                    prefix="NGN "
                    value={value}
                    allowLeadingZeros={true}
                    onChange={(e) => {
                      console.log("eeeee", e.target.value);

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

        <div className="flex gap-2 justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
