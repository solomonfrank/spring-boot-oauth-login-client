import { EventProps } from "@/types";
import { useEffect, useState } from "react";
import Calendar, { TileArgs } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaClock, FaGlobe, FaMoneyBill } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getEventBySlugHandler } from "../api/getEventBySlug";

import { TIMEFORMAT } from "@/libs/date-fns";
import dayjs from "@/libs/dayjs";
import { getWeekDayName } from "@/utils/weekday";
import { TimeSlot } from "../component/TimeSlot";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const EventBooking = () => {
  const params = useParams();
  const [eventDetail, setEventDetails] = useState<EventProps | null>(null);
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());

  const browsingDate = dayjs().startOf("month");

  const month = browsingDate
    ? new Intl.DateTimeFormat("en", { month: "long" }).format(
        new Date(browsingDate.year(), browsingDate.month())
      )
    : null;

  console.log("browsingDate", browsingDate, getWeekDayName(), month);

  const weekdayOfFirst = browsingDate.date(1).day();

  console.log("params", params, weekdayOfFirst, browsingDate.daysInMonth());

  useEffect(() => {
    const getEventInfo = async () => {
      const response = await getEventBySlugHandler(
        params.username as string,
        params.title as string
      );

      setEventDetails(response);
    };

    if (params.username && params.title) {
      getEventInfo();
    }
  }, [params.title, params.username]);

  const getTimeZone = () => {
    return dayjs.tz.guess();
  };

  const onChange = (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log("dateSelected", value, event);

    setSelectedDate(value);
  };

  const tileClassName = ({ date, view }: TileArgs) => {
    // Check if the date is the current date
    if (view === "month" && date.getDate() === new Date().getDate()) {
      return "bg-[#000] text-white"; // Return the class name for the current date
    }
    return null; // Return null for other dates
  };

  console.log("veeeee", eventDetail);

  return (
    <div className="w-full max-h-screen h-screen bg-slate-200 flex items-center justify-center">
      <div className=" w-[70%] h-[70vh] flex justify-between mx-auto bg-white border rounded-lg  border-gray-300 divide-x">
        <div className="basis-1/4 p-5">
          <h3 className=" text-[16px] text-gray-800">{eventDetail?.owner}</h3>

          <h3 className=" text-2xl">{eventDetail?.title}</h3>

          <h3 className=" text-md break-words">{eventDetail?.description}</h3>

          <div className="text-md flex gap-1 mt-9">
            <span>
              <FaClock color="gray" />
            </span>
            <span>{eventDetail?.duration}mins</span>
          </div>

          <div className="text-md flex gap-1 mt-3">
            <span>
              <FaGlobe color="gray" />
            </span>
            <span>{getTimeZone()}</span>
          </div>

          <div className="text-md flex gap-1 mt-3">
            <span>
              <FaMoneyBill color="gray" />
            </span>
            <span>{eventDetail?.price ?? "Free"}</span>
          </div>
        </div>
        <div className="basis-1/2 p-5">
          <div>
            <Calendar
              onChange={onChange}
              value={selectedDate}
              defaultView="month"
              className="text-2xl font-sans w-full h-full border-none"
              next2Label={null}
              prev2Label={null}
              view="month"
              minDate={new Date()}
              tileClassName={tileClassName}
              onActiveStartDateChange={(e) => console.log("hello", e)}
            />
          </div>
        </div>
        <div className="basis-1/4 p-5">
          {eventDetail && (
            <TimeSlot
              format={TIMEFORMAT.TWELVE_HOUR}
              selectedDate={selectedDate as Date}
              eventDetail={eventDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
};
