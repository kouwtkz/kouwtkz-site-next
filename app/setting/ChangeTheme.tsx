"use client";
import React from "react";
import ThemeSetter from "../components/navigation/ThemeSetter";

export function ChangeThemeButton() {
  return (
    <>
      <ThemeSetter className="button cursor-pointer text-2xl bg-main rounded-lg px-4 py-2">
        テーマきりかえ
      </ThemeSetter>
    </>
  );
}
