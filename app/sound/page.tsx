import React from "react";
import SoundPage from "./SoundPage";

import { Metadata } from "next";
const title = "SOUND";
export const metadata: Metadata = { title };

export default function page() {
  return <SoundPage />;
}
