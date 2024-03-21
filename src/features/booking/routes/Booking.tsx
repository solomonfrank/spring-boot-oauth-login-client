import { useEffect, useState } from "react";
import { getUserBooking } from "../api/getUserBooking";
import { BookingResponse } from "../type";

import { TIMEFORMAT } from "@/libs/date-fns";
import dayjs from "@/libs/dayjs";

export const Booking = () => {
  const [booking, setBooking] = useState<BookingResponse[] | null>(null);
  useEffect(() => {
    const getBooking = async () => {
      const response = await getUserBooking();

      console.log("response", response);

      setBooking(response);
    };

    getBooking();
  }, []);
  return (
    <div className="flex flex-col gap-2">
      {booking?.map((item) => (
        <div key={item.id} className=" border p-5">
          <div>
            <strong>{item.title}</strong> between you and {item.attendee?.name}
          </div>

          <div>
            {dayjs(item.startDate).format(TIMEFORMAT.TWELVE_HOUR)} -{" "}
            {dayjs(item.endDate).format(TIMEFORMAT.TWELVE_HOUR)}{" "}
          </div>
        </div>
      ))}
    </div>
  );
};
