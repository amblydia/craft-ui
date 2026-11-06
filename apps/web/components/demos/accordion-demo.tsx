import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/craft/accordion";

export function AccordionDemo() {
  return (
    <Accordion className="max-w-lg" defaultValue={["rules"]}>
      <AccordionItem value="rules">
        <AccordionTrigger>World rules</AccordionTrigger>
        <AccordionContent>
          Keep inventory is on, and mobs don&apos;t break blocks. Only the host
          can change these.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="players">
        <AccordionTrigger>Players</AccordionTrigger>
        <AccordionContent>
          Four players have joined this world. Two are online now.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem disabled value="experiments">
        <AccordionTrigger>Experiments</AccordionTrigger>
        <AccordionContent>Not available on this world.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
