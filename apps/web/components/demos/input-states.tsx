import { Input } from "@/components/craft/input";

export function InputStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input aria-label="Disabled" defaultValue="Disabled" disabled />
      <Input aria-label="Name in use" defaultValue="Taken name" error />
      <Input aria-label="Small" placeholder="Small" size="sm" />
      <Input aria-label="Large" placeholder="Large" size="lg" />
    </div>
  );
}
