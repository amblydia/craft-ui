import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";

const variants = ["surface", "raised", "sunken", "light"] as const;

export function PanelVariants() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {variants.map((variant) => (
        <Panel key={variant} variant={variant}>
          <PanelHeader>
            <PanelTitle>{variant}</PanelTitle>
          </PanelHeader>
          <PanelContent>A panel with the {variant} surface.</PanelContent>
        </Panel>
      ))}
    </div>
  );
}
