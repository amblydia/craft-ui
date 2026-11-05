import { Button } from "@/components/craft/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/craft/tooltip";

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="secondary" />}>
        Hover or focus me
      </TooltipTrigger>
      <TooltipContent>Opens the world settings</TooltipContent>
    </Tooltip>
  );
}
