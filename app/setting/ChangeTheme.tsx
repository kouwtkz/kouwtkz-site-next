"use client"
import React from "react";

export function ChangeThemeButton() {
  return (
    <>
      <button
        type="button"
        onClick={() =>
          document?.documentElement.classList.toggle("theme-orange")
        }
        className="cursor-pointer text-2xl bg-main"
      >
        テーマきりかえ
      </button>
    </>
  );
}
