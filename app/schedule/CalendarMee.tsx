"use client";

import FullCalendar from "@fullcalendar/react";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from "@fullcalendar/core/locales-all";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Suspense, useCallback, useRef } from "react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { GoogleCalendarOptionsType, eventsItemType } from "./CalendarType";

interface CalendarMeeProps extends React.ImgHTMLAttributes<HTMLDivElement> {
  google?: GoogleCalendarOptionsType;
  events?: eventsItemType[];
  width?: number;
  height?: number;
}

export default function CalendarMee({
  google,
  height,
  style = {},
  ...args
}: CalendarMeeProps) {
  const calendarRef = useRef<FullCalendar>(null);
  if (!google) return <div>Googleカレンダーのプロパティがありません</div>;
  const GoogleOptions = {
    googleCalendarApiKey: google.apiKey,
    eventSources: [
      {
        googleCalendarId: google.calendarId,
      },
    ],
  };
  if (height !== undefined) style.height = height;
  return (
    <div {...{ ...args, style }}>
      <FullCalendar
        height={height}
        ref={calendarRef}
        plugins={[
          googleCalendarPlugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
        ]}
        locales={allLocales}
        {...GoogleOptions}
        timeZone="Asia/Tokyo"
        initialView="listMonth"
        locale={"ja"}
        dayCellContent={(e) => e.dayNumberText.replace("日", "")}
        dayMaxEvents={true}
        businessHours={true}
        allDayText="終日"
        eventClick={(args) => {
          window.open(
            args.event.url,
            "google-calendar-event",
            "width=700,height=600"
          );
          args.jsEvent.preventDefault();
        }}
        headerToolbar={{
          end: "dayGridMonth,dayGridWeek,listMonth prev,today,next",
        }}
        buttonText={{
          today: "現在",
          list: "予定",
        }}
        views={{
          dayGridWeek: {
            titleFormat: ({ start, end }) => {
              const endYear =
                end && start.year !== end?.year ? `${end.year}/` : "";
              return (
                `${start.year}/${start.month + 1}/${start.day}` +
                (end ? ` - ${endYear}${end.month + 1}/${end.day}` : "")
              );
            },
          },
        }}
      />
    </div>
  );
}
