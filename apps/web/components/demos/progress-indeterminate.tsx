import { Progress } from "@/components/craft/progress";

export function ProgressIndeterminate() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Progress label="Connecting" value={null} />
      <Progress aria-label="Loading" size="sm" value={null} />
    </div>
  );
}
