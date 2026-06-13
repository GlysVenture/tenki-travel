import type { ColorRGB } from "./types";

function hexToRgb(hex: string): ColorRGB {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
   ] : [0, 0, 0];
}

export const LineColorsHex = {
    "B": "#22c202",
    "IC": "#fa0710",
    "IR": "#fc0568",
    "RE": "#fc8105",
    "R": "#fab107",
    "S": "#07b3e3",
    "walk": "#164ff7",
    "unknown": "#fcc203",
};

export const LineColors = Object.fromEntries(Object.entries(LineColorsHex).map(([k, v]) => [k, hexToRgb(v)]));
