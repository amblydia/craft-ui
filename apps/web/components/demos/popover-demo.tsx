import { Button } from "@/components/craft/button";
import { Input } from "@/components/craft/input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/craft/popover";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" />}>
        World seed
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>World seed</PopoverTitle>
        <PopoverDescription>
          Share it, and anyone can make the same world.
        </PopoverDescription>
        <Input aria-label="Seed" defaultValue="1772835215" readOnly size="sm" />
        <PopoverClose render={<Button size="sm" />}>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
