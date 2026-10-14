"use client";
import { useAnimatedNumber } from "@/lib/hooks";

interface Props {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "", className = "" }: Props) {
  const animated = useAnimatedNumber(value);
  return (
    <span className={className}>
      {prefix}{animated.toFixed(decimals)}{suffix}
    </span>
  );
}
