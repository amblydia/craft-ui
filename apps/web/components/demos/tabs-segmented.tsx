import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/craft/tabs";

export function TabsSegmented() {
  return (
    <Tabs className="max-w-lg" defaultValue="survival">
      <TabsList aria-label="Game mode" variant="segmented">
        <TabsTrigger value="survival">Survival</TabsTrigger>
        <TabsTrigger value="creative">Creative</TabsTrigger>
        <TabsTrigger value="adventure">Adventure</TabsTrigger>
      </TabsList>
      <TabsContent value="survival">Gather, craft and survive.</TabsContent>
      <TabsContent value="creative">Build with no limits.</TabsContent>
      <TabsContent value="adventure">
        Play a world as its maker intended.
      </TabsContent>
    </Tabs>
  );
}
