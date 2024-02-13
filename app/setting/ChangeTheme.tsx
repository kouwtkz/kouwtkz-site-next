"use client";
import React from "react";
import { useThemeState } from "@/app/context/ThemeSetter";

export function ChangeThemeButton() {
  const { next } = useThemeState();
  return (
    <>
      <button
        type="button"
        onClick={next}
        className="cursor-pointer text-2xl bg-main rounded-lg px-4 py-2"
      >
        テーマきりかえ
      </button>
    </>
  );
}
