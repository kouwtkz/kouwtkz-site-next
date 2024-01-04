import { readFileSync } from "fs";
import CalendarMee from "./CalendarMee";
import { GoogleCalendarOptionsType } from "./CalendarType";
import { Metadata } from "next";
import SchedulePage from "./SchedulePage";
import { Suspense } from "react";
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
    <Suspense>
      <SchedulePage title={title} google={googleCalenderOptions} />
    </Suspense>
  );
}
