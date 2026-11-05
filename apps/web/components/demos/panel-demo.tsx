import { Button } from "@/components/craft/button";
import {
  Panel,
  PanelActions,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";

export function PanelDemo() {
  return (
    <Panel className="w-full max-w-md">
      <PanelHeader>
        <PanelTitle>Harbor</PanelTitle>
        <PanelActions>
          <Button size="sm" variant="secondary">
            Edit
          </Button>
        </PanelActions>
        <PanelDescription>Last played on May 15</PanelDescription>
      </PanelHeader>
      <PanelContent>
        A survival world with three players and a very large lighthouse.
      </PanelContent>
      <PanelFooter>
        <Button fullWidth>Play</Button>
      </PanelFooter>
    </Panel>
  );
}
