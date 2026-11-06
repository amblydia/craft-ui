import { Spinner } from "@/components/craft/spinner";

export function SpinnerDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
      <Spinner label="Generating world" showLabel />
    </div>
  );
}
