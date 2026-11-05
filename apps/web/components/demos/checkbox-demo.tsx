import { Checkbox } from "@/components/craft/checkbox";

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox defaultChecked label="Show coordinates" />
      <Checkbox label="Friendly fire" />
      <Checkbox disabled label="Locked by the host" />
      <Checkbox defaultChecked disabled label="Always on" />
    </div>
  );
}
