import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";

const orders = [
  { label: "Last played", value: "played" },
  { label: "Name", value: "name" },
  { label: "Size", value: "size" },
];

export function SelectSunken() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Select items={orders}>
        <SelectTrigger aria-label="Sort worlds" variant="sunken">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {orders.map((order) => (
            <SelectItem key={order.value} value={order.value}>
              {order.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
