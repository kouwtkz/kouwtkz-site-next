"use client";

import React from "react";

export default function ShareButton() {
  return (
    <button
      className="m-2 py-2 px-3 text-xl rounded-2xl bg-main"
      type="button"
      onClick={async () => {
        try {
          await navigator.share({
            text: "test title",
            url: "http://localhost",
          });
        } catch (error) {
          console.error(error);
        }
      }}
    >
      シェアする
    </button>
  );
}
