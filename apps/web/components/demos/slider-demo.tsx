import { Slider } from "@/components/craft/slider";

export function SliderDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Slider defaultValue={70} label="Music" showValue />
      <Slider
        defaultValue={12}
        label="Render distance"
        max={32}
        min={4}
        showSteps
        showValue
        step={2}
      />
      <Slider defaultValue={40} disabled label="Locked by the host" showValue />
      <Slider aria-label="No visible label" defaultValue={25} />
    </div>
  );
}
