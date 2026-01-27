"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";

type AmbientToggleProps = {
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
};

type AmbientAudio = {
  ctx: AudioContext;
  master: GainNode;
  stop: () => void;
};

const createNoiseBuffer = (ctx: AudioContext) => {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.25;
  }
  return buffer;
};

const buildAmbient = async (): Promise<AmbientAudio | null> => {
  const AudioCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;

  const ctx = new AudioCtor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const lowPad = ctx.createBiquadFilter();
  lowPad.type = "lowpass";
  lowPad.frequency.value = 320;
  lowPad.Q.value = 0.7;

  const lowGain = ctx.createGain();
  lowGain.gain.value = 0.22;

  const oscA = ctx.createOscillator();
  oscA.type = "sine";
  oscA.frequency.value = 55;
  const oscB = ctx.createOscillator();
  oscB.type = "sine";
  oscB.frequency.value = 110;

  oscA.connect(lowPad);
  oscB.connect(lowPad);
  lowPad.connect(lowGain);
  lowGain.connect(master);

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(ctx);
  noiseSource.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 180;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.08;

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);

  oscA.start();
  oscB.start();
  noiseSource.start();
  lfo.start();

  try {
    await ctx.resume();
  } catch {
    ctx.close().catch(() => undefined);
    return null;
  }
  master.gain.setTargetAtTime(0.04, ctx.currentTime, 1.4);

  const stop = () => {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    window.setTimeout(() => {
      oscA.stop();
      oscB.stop();
      noiseSource.stop();
      lfo.stop();
      ctx.close().catch(() => undefined);
    }, 900);
  };

  return { ctx, master, stop };
};

export const AmbientToggle = ({ className, iconClassName, labelClassName }: AmbientToggleProps) => {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<AmbientAudio | null>(null);

  const toggle = useCallback(async () => {
    if (enabled) {
      audioRef.current?.stop();
      audioRef.current = null;
      setEnabled(false);
      return;
    }

    const audio = await buildAmbient();
    if (!audio) return;
    audioRef.current = audio;
    setEnabled(true);
  }, [enabled]);

  useEffect(() => {
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      data-active={enabled ? "true" : "false"}
      aria-pressed={enabled}
      aria-label="Toggle ambient audio"
    >
      <span className={clsx(iconClassName)} aria-hidden>
        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </span>
      <span className={clsx(labelClassName)}>AMBIENT</span>
    </button>
  );
};
