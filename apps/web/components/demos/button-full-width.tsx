import { Button } from "@/components/craft/button";

export function ButtonFullWidth() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Button fullWidth>Create new world</Button>
      <Button fullWidth variant="secondary">
        Import world
      </Button>
    </div>
  );
}
