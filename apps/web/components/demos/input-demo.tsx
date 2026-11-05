import { Input } from "@/components/craft/input";

export function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input aria-label="World name" placeholder="World name" />
      <Input aria-label="Password" placeholder="Password" type="password" />
      <Input aria-label="Seed" placeholder="Seed" type="number" />
    </div>
  );
}
