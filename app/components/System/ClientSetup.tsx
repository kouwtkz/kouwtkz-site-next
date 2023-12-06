"use client";
import React, { useEffect } from "react";
import { isMobile } from "react-device-detect";
// import { create } from "zustand";

const ClientSetup = () => {
  useEffect(() => {
    if (isMobile) {
      document.documentElement.classList.add("mobile");
    }
  });
  return <></>;
};

export default ClientSetup;
