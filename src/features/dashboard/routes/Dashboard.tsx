import {
  EventBookingAnalysis,
  getEventAnaysisHandler,
} from "@/features/events/api/getEventAnaysis";
import { getUser } from "@/libs/jwt-decode";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const user = getUser();
  const [analysis, setAnalysis] = useState<EventBookingAnalysis>();

  useEffect(() => {
    const getEventAnaysis = async () => {
      const response = await getEventAnaysisHandler(user?.userId as number);
      console.log("responseee", response);
      setAnalysis(response);
    };

    getEventAnaysis();
  }, []);
  return (
    <section>
      <div className="flex w-full gap-3">
        <div className=" gap-4 text-md p-3 min-h-[200px] border rounded-md bg-[#fff] shadow-md  w-1/4 flex items-center justify-center flex-col ">
          <h4 className="text-black text-xl">0</h4>
          <h5>Created event</h5>
        </div>
        <div className=" gap-4 text-md p-3 min-h-[200px] border rounded-md bg-[#fff] shadow-md  w-1/4 flex items-center justify-center flex-col ">
          <h4 className="text-black text-xl">{analysis?.totalUpcomingCount}</h4>
          <h5>Upcoming event</h5>
        </div>
        <div className=" gap-4 text-md p-3 min-h-[200px] border rounded-md bg-[#fff] shadow-md  w-1/4 flex items-center justify-center flex-col ">
          <h4 className="text-black text-xl">{analysis?.totalPastCount}</h4>
          <h5>Past event</h5>
        </div>
        <div className=" gap-4 text-md p-3 min-h-[200px] border rounded-md bg-[#fff] shadow-md  w-1/4 flex items-center justify-center flex-col ">
          <h4 className="text-black text-xl">0</h4>
          <h5>Cancelled event</h5>
        </div>
      </div>
    </section>
  );
};
