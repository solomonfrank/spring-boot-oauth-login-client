import { InputField } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";
import { createEventSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createEventHandler } from "../api/createEvent";

type CreateEventFormProps = {
  onClose: () => void;
  reload: () => void;
};

export type FormValue = {
  title: string;
  duration: number;
  description: string;
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

      const response = await createEventHandler(data);

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
