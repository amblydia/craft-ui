import { buttonVariants } from "@/components/craft/button-variants";

export function ButtonLink() {
  return (
    <a className={buttonVariants({ variant: "secondary" })} href="#usage">
      This is a real link
    </a>
  );
}
