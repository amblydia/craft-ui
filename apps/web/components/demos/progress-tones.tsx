import { Progress } from "@/components/craft/progress";

export function ProgressTones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Progress label="Info" tone="info" value={70} />
      <Progress label="Primary" tone="primary" value={55} />
      <Progress label="Warning" tone="warning" value={40} />
      <Progress label="Destructive" tone="destructive" value={25} />
    </div>
  );
}
