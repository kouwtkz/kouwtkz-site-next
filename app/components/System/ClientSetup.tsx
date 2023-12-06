"use client";
import React from "react";
import { isMobile } from "react-device-detect";
// import { create } from "zustand";

const ClientSetup = () => {
  if (isMobile) {
    document.documentElement.classList.add("mobile");
  }
  return <></>;
};

export default ClientSetup;
