import MultiParser from "@/app/components/functions/MultiParser";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { create } from "zustand";

type PreviewModeType = {
  previewMode: boolean;
  previewBody?: string;
};
type PreviewModeStateType = PreviewModeType & {
  setPreviewMode: (option: PreviewModeType) => void;
  togglePreviewMode: (body?: string) => void;
};

export const usePreviewMode = create<PreviewModeStateType>((set) => ({
  previewMode: false,
  previewBody: "",
  setPreviewMode: (option) => {
    set(option);
  },
  togglePreviewMode: (body = "") => {
    set((state) => {
      const newState = { previewMode: !state.previewMode } as PreviewModeType;
      if (newState) newState.previewBody = body;
      return newState;
    });
  },
}));

export default function PostTextarea({ body }: { body?: string }) {
  const { previewMode, previewBody, togglePreviewMode, setPreviewMode } =
    usePreviewMode();
  const textarea = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const firstCheckMode = useRef(true);

  useEffect(() => {
    if (firstCheckMode.current) {
      setPreviewMode({ previewMode: false, previewBody: "" });
      firstCheckMode.current = false;
    }
  });
  useHotkeys(
    "ctrl+period",
    () => {
      togglePreviewMode(textarea.current.value);
    },
    { enableOnFormTags: ["TEXTAREA"] }
  );
  useHotkeys("n", (e) => {
    textarea.current.focus();
    e.preventDefault();
  });

  const bodyClass = "mx-auto w-[85%] max-w-2xl min-h-[12rem] p-2 text-start";
  return (
    <>
      <textarea
        name="body"
        ref={textarea}
        id="post_body_area"
        placeholder="今何してる？"
        defaultValue={body}
        className={bodyClass + (previewMode ? " hidden" : " block")}
      />
      <div
        className={
          bodyClass + " preview-area" + (previewMode ? " block" : " hidden")
        }
      >
        <MultiParser all={true}>{previewBody}</MultiParser>
      </div>
    </>
  );
}
