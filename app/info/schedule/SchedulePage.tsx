"use client";

import CalendarMee from "./CalendarMee";
import { GoogleCalendarOptionsType } from "./CalendarType";

export default function SchedulePage({
  title = "Schedule",
  google,
}: {
  title?: string;
  google?: GoogleCalendarOptionsType;
}) {
  return (
    <div>
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-8">
        {title}
      </h1>
      <CalendarMee
        google={google}
        height={580}
        className="text-sm sm:text-base m-2 sm:mx-auto max-w-4xl"
      />
    </div>
  );
}
