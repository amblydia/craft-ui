import { Switch } from "@/components/craft/switch";

export function SwitchDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch defaultChecked label="Show coordinates" />
      <Switch label="Friendly fire" />
      <Switch disabled label="Locked by the host" />
      <Switch defaultChecked disabled label="Always on" />
    </div>
  );
}
