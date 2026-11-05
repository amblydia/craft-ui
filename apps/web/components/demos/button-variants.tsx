import { Button } from "@/components/craft/button";

export function ButtonVariants() {
  return (
    <>
      <Button variant="hero">Play</Button>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </>
  );
}
