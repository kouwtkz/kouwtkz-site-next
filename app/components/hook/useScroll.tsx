"use client"

import React, { useLayoutEffect, useState } from "react";

export default function useScroll(): number[] {
  const [scroll, setScroll] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setScroll([window.scrollX, window.scrollY]);
    };

    window.addEventListener("scroll", updateSize);
    updateSize();

    return () => window.removeEventListener("scroll", updateSize);
  }, []);
  return scroll;
}
