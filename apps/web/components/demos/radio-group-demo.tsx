import { Radio, RadioGroup } from "@/components/craft/radio-group";

export function RadioGroupDemo() {
  return (
    <RadioGroup aria-label="Difficulty" defaultValue="normal">
      <Radio label="Peaceful" value="peaceful" />
      <Radio label="Easy" value="easy" />
      <Radio label="Normal" value="normal" />
      <Radio label="Hard" value="hard" />
      <Radio disabled label="Hardcore" value="hardcore" />
    </RadioGroup>
  );
}
