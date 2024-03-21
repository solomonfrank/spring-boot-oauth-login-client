import { InputField } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";
import { Dialaog } from "@/components/ui/Dialog";
import { TIMEFORMAT } from "@/libs/date-fns";

import dayjs from "@/libs/dayjs";
import { EventProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AttendeeProps,
  BookingProps,
  scheduleEventHandler,
} from "../api/scheduleEvent";
import { bookSchema } from "../utils/schema";

export type TimeSlotProps = {
  format: TIMEFORMAT;
  selectedDate?: Date | null;
  eventDetail: EventProps | null;
  //  onSelectedTime?: (value: Dayjs) => void;
};

type FormValue = {
  email: string;
  name: string;
  phoneNumber: string;
};

export const TimeSlot = ({
  format,
  selectedDate,
  eventDetail,
}: TimeSlotProps) => {
  // Function to generate 30-minute time interval slots for future times only

  const duration = eventDetail?.duration as number;

  const [toggleAttendeeForm, setToggleAttendeeForm] = useState(false);

  const [slotAvailable, setSlotAvailable] = useState<
    { date: Dayjs; active: boolean }[]
  >([]);

  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const date = dayjs(selectedDate as Date).format("YYYY-MM-DD");

  const selectedDateTime = dayjs(date)
    .set("minute", Number(selectedTime?.minute()))
    .set("hour", Number(selectedTime?.hour()));

  const methods = useForm<FormValue>({
    resolver: zodResolver(bookSchema),
    mode: "onChange",
  });

  const { handleSubmit, register } = methods;

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);
      const attendee: AttendeeProps = {
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        timeZone: dayjs.tz.guess(),
      };

      const payload: BookingProps = {
        attendee,
        bookStatus: "ACCEPTED",
        startDate: selectedDateTime.format("YYYY-MM-DDTHH:mm:ssZ"),
        endDate: selectedDateTime
          .set("minute", duration)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        title: eventDetail?.title as string,
        description: eventDetail?.description as string,
        location: "",
        eventTypeId: eventDetail?.id as number,
      };

      await scheduleEventHandler(payload);

      setLoading(false);
      toast.success("Event booked successfully");
      setToggleAttendeeForm(false);
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

  function generateFutureTimeSlots() {
    // Create an array to store the time slots
    const timeSlots = [];

    // Set the current time
    const currentTime = dayjs(selectedDate);

    // Set the start time as the next 30-minute interval
    let startTime = currentTime.startOf("hour");

    if (currentTime.minute() >= duration) {
      startTime = startTime.add(1, "hour").startOf("hour");
    }

    // Set the end time (e.g., end of the day)
    const endTime = currentTime.endOf("day");

    // Loop through the time range in 30-minute intervals
    let currentTimeSlot = startTime.clone();
    while (currentTimeSlot.isBefore(endTime)) {
      // Format the current time in HH:mm format
      const timeSlot = currentTimeSlot;

      // Add the time slot to the array
      timeSlots.push(timeSlot);

      // Increment the current time by 30 minutes
      currentTimeSlot = currentTimeSlot.add(duration, "minutes");
    }

    return timeSlots;
  }

  useEffect(() => {
    const futureTimeSlots = generateFutureTimeSlots();

    const renderTimeSlot = futureTimeSlots.map((item) => ({
      date: item,
      active: false,
    }));

    setSlotAvailable(renderTimeSlot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const timePickerHandler = (date: Dayjs, index: number) => {
    setSlotAvailable((prev) => {
      return prev.map((item, idx) => {
        if (index === idx) {
          return {
            ...item,
            active: true,
          };
        } else
          return {
            ...item,
            active: false,
          };
      });
    });

    setSelectedTime(date);
  };

  return (
    <div className="flex flex-col gap-1 overflow-auto h-full">
      {slotAvailable.map((item, idx) => {
        return (
          <TimePicker
            key={item.date.toString()}
            date={item.date}
            format={format}
            isActive={item.active}
            onSelectedTime={(date) => timePickerHandler(date, idx)}
            toggleAttendeeForm={(status) => setToggleAttendeeForm(status)}
          />
        );
      })}

      <Dialaog
        open={toggleAttendeeForm}
        onClose={() => setToggleAttendeeForm(false)}
        title="Attendee form"
        closable={true}
      >
        <FormProvider {...methods}>
          <form className="w-full block" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <InputField
                label="Email address"
                isFullWidth={true}
                {...register("email")}
                inputMode="email"
                name="email"
              />
            </div>
            <div className="mb-4">
              <InputField
                label="Full name"
                isFullWidth={true}
                type="text"
                {...register("name")}
                name="name"
              />
            </div>

            <div className="mb-4">
              <InputField
                label="Phone number"
                isFullWidth={true}
                type="text"
                {...register("phoneNumber")}
                name="phoneNumber"
              />
            </div>

            <Button
              type="submit"
              size="medium"
              loading={loading}
              disabled={loading}
              className="w-full bg-black text-black  p-2 rounded-md my-2"
            >
              Schedule Event
            </Button>
          </form>
        </FormProvider>
      </Dialaog>
    </div>
  );
};

type TimePickerProps = {
  date: Dayjs;
  format: TIMEFORMAT;
  isActive: boolean;
  onSelectedTime: (value: Dayjs) => void;
  toggleAttendeeForm: (status: boolean) => void;
};

export const TimePicker = ({
  date,
  format,
  onSelectedTime,
  isActive,
  toggleAttendeeForm,
}: TimePickerProps) => {
  if (isActive) {
    return (
      <div className="flex gap-2 w-full" key={date.toString()}>
        <Button size="small" className="grow">
          {date.format(format)}
        </Button>
        <Button
          size="small"
          className="grow"
          onClick={() => toggleAttendeeForm(true)}
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <Button key={date.toString()} onClick={() => onSelectedTime(date)}>
      {date.format(format)}
    </Button>
  );
};
