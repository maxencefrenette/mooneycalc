"use client";
import { Label } from "./ui/label";
import { Slider } from "~/components/ui/slider";

interface BidAskSliderProps {
  label: string;
  inverted: boolean;
  value: number;
  updateValue: (value: number) => void;
}
export function BidAskSlider({
  label,
  inverted,
  value,
  updateValue,
}: BidAskSliderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="market" className="text-center">
        {label}
      </Label>
      <div className="flex gap-2 text-sm">
        Bid
        <Slider
          className="w-96"
          min={0}
          max={1}
          step={0.05}
          inverted={inverted}
          value={[value]}
          onValueChange={([value]) => {
            if (value === undefined) return;
            updateValue(value);
          }}
        />
        Ask
      </div>
    </div>
  );
}
