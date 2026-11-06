import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";

const groups = [
  {
    items: [
      { disabled: false, label: "Survival", value: "survival" },
      { disabled: false, label: "Creative", value: "creative" },
    ],
    label: "Standard",
  },
  {
    items: [
      { disabled: false, label: "Adventure", value: "adventure" },
      { disabled: true, label: "Spectator", value: "spectator" },
    ],
    label: "Special",
  },
];

export function SelectGroups() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Select items={groups.flatMap((group) => group.items)}>
        <SelectLabel>Game mode</SelectLabel>
        <SelectTrigger>
          <SelectValue placeholder="Choose a mode" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group, index) => (
            <SelectGroup key={group.label}>
              {index > 0 ? <SelectSeparator /> : null}
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              {group.items.map((item) => (
                <SelectItem
                  disabled={item.disabled}
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
