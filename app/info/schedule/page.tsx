import { readFileSync } from "fs";
import CalendarMee from "./CalendarMee";
import { GoogleCalendarOptionsType } from "./CalendarType";
import { Metadata } from "next";
import SchedulePage from "./SchedulePage";
import { Suspense } from "react";
const title = "Schedule".toUpperCase();
export const metadata: Metadata = { title };
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

export default function Page() {
  let googleCalenderOptions: GoogleCalendarOptionsType | undefined;
  try {
    googleCalenderOptions = JSON.parse(
      String(readFileSync(cwd + "/_data/regist/googleCalendar.json"))
    );
  } catch {}
  return (
    <Suspense>
      <SchedulePage title={title} google={googleCalenderOptions} />
    </Suspense>
  );
}
