import { SetRegisterReturn } from "@/app/components/form/hook/SetRegister";
import MultiParser from "@/app/components/tag/MultiParser";
import React, { useEffect, useRef } from "react";
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

type PostTextareaProps = {
  registed: SetRegisterReturn;
  disabled?: boolean;
};
export default function PostTextarea({
  registed,
  disabled,
}: PostTextareaProps) {
  const { previewMode, previewBody, togglePreviewMode, setPreviewMode } =
    usePreviewMode();
  const firstCheckMode = useRef(true);

  useEffect(() => {
    if (firstCheckMode.current) {
      setPreviewMode({ previewMode: false, previewBody: "" });
      firstCheckMode.current = false;
    }
  });
  const bodyClass = "mx-auto w-[85%] max-w-2xl min-h-[24em] p-2 text-start";
  return (
    <>
      <textarea
        {...registed}
        disabled={disabled}
        id="post_body_area"
        placeholder="今何してる？"
        className={bodyClass + (previewMode ? " hidden" : " block")}
      />
      <div
        className={
          bodyClass + " preview-area" + (previewMode ? " block" : " hidden")
        }
      >
        <MultiParser className="blog">{previewBody}</MultiParser>
      </div>
    </>
  );
}
