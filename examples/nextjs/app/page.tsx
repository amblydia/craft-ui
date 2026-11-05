import { buttonVariants } from "@/components/craft/button-variants";
import { Playground } from "@/components/playground";

export default function Page() {
  return (
    <>
      <Playground />
      <a className={buttonVariants({ variant: "secondary" })} href="#top">
        Back to top
      </a>
    </>
  );
}
