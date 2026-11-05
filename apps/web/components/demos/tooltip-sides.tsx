import { Button } from "@/components/craft/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/craft/tooltip";

const sides = ["top", "right", "bottom", "left"] as const;

// The provider shares one delay, so moving between buttons feels instant.
export function TooltipSides() {
  return (
    <TooltipProvider delay={200}>
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button size="sm" variant="secondary" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Opens on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
}
