import { Badge } from "@/components/craft/badge";

export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3">
        <Badge>Owner</Badge>
        <Badge variant="primary">Online</Badge>
        <Badge variant="info">New</Badge>
        <Badge variant="warning">Beta</Badge>
        <Badge variant="destructive">Banned</Badge>
        <Badge variant="accent">Realms</Badge>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Badge size="sm">Owner</Badge>
        <Badge size="sm" variant="primary">
          Online
        </Badge>
        <Badge size="sm" variant="info">
          New
        </Badge>
      </div>
    </div>
  );
}
