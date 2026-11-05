import { Progress } from "@/components/craft/progress";

export function ProgressCustom() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Progress color="#9b59d0" label="Custom color" value={65} />
      <Progress aria-label="Thin" size="sm" value={65} />
    </div>
  );
}
