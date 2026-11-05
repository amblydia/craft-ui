import { Search01Icon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/craft/input";

export function InputIcons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input
        aria-label="Search worlds"
        leadingIcon={<HugeiconsIcon icon={Search01Icon} />}
        placeholder="Search worlds"
      />
      <Input
        aria-label="Password"
        placeholder="Password"
        trailingIcon={<HugeiconsIcon icon={ViewOffIcon} />}
        type="password"
      />
    </div>
  );
}
