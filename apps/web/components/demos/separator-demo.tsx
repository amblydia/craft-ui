import { Separator } from "@/components/craft/separator";

export function SeparatorDemo() {
  return (
    <div className="font-craft-display flex w-full max-w-sm flex-col gap-4 text-(length:--craft-label-size)">
      <p>Video settings</p>
      <Separator />
      <div className="flex h-8 items-center gap-4">
        <span>Graphics</span>
        <Separator orientation="vertical" />
        <span>Display</span>
        <Separator orientation="vertical" />
        <span>Controls</span>
      </div>
    </div>
  );
}
