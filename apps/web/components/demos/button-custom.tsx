import { Button } from "@/components/craft/button";

// Override the tokens on one button. The bevel and the states keep working.
export function ButtonCustom() {
  return (
    <Button className="[--craft-primary-active-hi:#7a9eee] [--craft-primary-active-lo:#5889ea] [--craft-primary-active:#204ba1] [--craft-primary-edge:#16356f] [--craft-primary-hi:#5889ea] [--craft-primary-hover-hi:#a3bdf3] [--craft-primary-hover-lo:#8cacf0] [--craft-primary-hover:#78a0ee] [--craft-primary-lo:#4a7fe8] [--craft-primary:#2e6be5]">
      Join server
    </Button>
  );
}
