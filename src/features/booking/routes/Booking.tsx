import { useEffect, useState } from "react";
import { getUserBooking } from "../api/getUserBooking";
import { PagedBookingResponse } from "../type";

import { TIMEFORMAT } from "@/libs/date-fns";
import dayjs from "@/libs/dayjs";
import { Pagination, PaginationProps } from "antd";

export const Booking = () => {
  const [booking, setBooking] = useState<PagedBookingResponse | null>(null);

  const [currentPageNumber, setCurrentPageNumber] = useState(0);

  useEffect(() => {
    const getBooking = async () => {
      const response = await getUserBooking({
        page: String(currentPageNumber),
        size: String(10),
      });

      setBooking(response);
    };

    getBooking();
  }, [currentPageNumber]);

  const onChange: PaginationProps["onChange"] = (pageNumber) => {
    console.log("pageNumberpageNumber", pageNumber);
    setCurrentPageNumber(pageNumber);
  };
  return (
    <div className="flex flex-col gap-2">
      {booking?.data?.map((item) => (
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

      <div className="flex justify-center py-3">
        <Pagination
          current={currentPageNumber}
          total={booking?.totalElements}
          onChange={onChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};
