import type { CSSProperties } from "react";

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function waitlistScaledHitStyle(rect: Rect, designWidth: number): CSSProperties {
  const scale = `min(1, 100vw / ${designWidth}px)`;
  return {
    left: `calc(${rect.left}px * ${scale})`,
    top: `calc(${rect.top}px * ${scale})`,
    width: `calc(${rect.width}px * ${scale})`,
    height: `calc(${rect.height}px * ${scale})`,
  };
}
