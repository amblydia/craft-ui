import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/craft/accordion";

export function AccordionMultiple() {
  return (
    <Accordion className="max-w-lg" multiple>
      <AccordionItem value="video">
        <AccordionTrigger>Video</AccordionTrigger>
        <AccordionContent>
          Render distance, brightness and field of view.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="audio">
        <AccordionTrigger>Audio</AccordionTrigger>
        <AccordionContent>Music, sounds and voice chat.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
