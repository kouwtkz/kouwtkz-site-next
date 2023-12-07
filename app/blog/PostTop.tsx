"use client";

import { useEffect } from "react";
import { usePostTargetState } from "./PostTargetState";

export default function PostTop() {
  const { postTarget, setPostTarget } = usePostTargetState();
  useEffect(() => {
    if (postTarget !== null) setPostTarget();
  });
  return null;
}
