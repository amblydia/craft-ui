import {
  Table,
  TableBody,
  TableEmpty,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
} from "@/components/craft/table";

function Header() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>World</TableHead>
        <TableHead>Mode</TableHead>
        <TableHead>Last played</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function TableStates() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Table>
        <Header />
        <TableBody>
          <TableEmpty colSpan={3}>
            No worlds yet. Create one to start.
          </TableEmpty>
        </TableBody>
      </Table>
      <Table>
        <Header />
        <TableBody>
          <TableLoading colSpan={3} label="Loading worlds" />
        </TableBody>
      </Table>
    </div>
  );
}
