"use client";
import React, { useEffect } from "react";
import { isMobile } from "react-device-detect";
// import { create } from "zustand";

export default function ClientSetup() {
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add("mobile");
    }
  });
  return <></>;
}
