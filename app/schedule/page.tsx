import { readFileSync } from "fs";
import CalendarMee from "./CalendarMee";
import { GoogleCalendarOptionsType } from "./CalendarType";
import { Metadata } from "next";
const title = "Schedule".toUpperCase();
export const metadata: Metadata = { title };

export default function Page() {
  let googleCalenderOptions: GoogleCalendarOptionsType | undefined;

  try {
    googleCalenderOptions = JSON.parse(
      String(readFileSync("_data/regist/googleCalendar.json"))
    );
  } catch {}
  return (
    <div>
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-8">
        {title}
      </h1>
      <CalendarMee
        google={googleCalenderOptions}
        height={500}
        className="text-sm sm:text-base m-2 sm:mx-auto max-w-4xl"
      />
    </div>
  );
}
