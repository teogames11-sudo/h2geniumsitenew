"use client";

import { Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";
import { useUiSound } from "@/components/ui/ui-sound";

type SoundToggleProps = {
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
};

export const SoundToggle = ({ className, iconClassName, labelClassName }: SoundToggleProps) => {
  const { enabled, toggle } = useUiSound();

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      data-active={enabled ? "true" : "false"}
      aria-pressed={enabled}
      aria-label="Toggle UI sound"
    >
      <span className={clsx(iconClassName)} aria-hidden>
        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </span>
      <span className={clsx(labelClassName)}>Sound</span>
    </button>
  );
};
