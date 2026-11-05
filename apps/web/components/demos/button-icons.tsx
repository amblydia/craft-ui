import {
  Add01Icon,
  ArrowRight01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/craft/button";

export function ButtonIcons() {
  return (
    <>
      <Button leadingIcon={<HugeiconsIcon icon={Add01Icon} />}>
        Create world
      </Button>
      <Button
        trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} />}
        variant="secondary"
      >
        Next
      </Button>
      <Button aria-label="Settings" size="icon" variant="secondary">
        <HugeiconsIcon icon={Settings01Icon} />
      </Button>
      <Button aria-label="Settings" size="icon" variant="ghost">
        <HugeiconsIcon icon={Settings01Icon} />
      </Button>
    </>
  );
}
