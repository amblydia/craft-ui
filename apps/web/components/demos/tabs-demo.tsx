import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/craft/tabs";

export function TabsDemo() {
  return (
    <Tabs className="max-w-lg" defaultValue="worlds">
      <TabsList>
        <TabsTrigger value="worlds">Worlds</TabsTrigger>
        <TabsTrigger value="realms">Realms</TabsTrigger>
        <TabsTrigger disabled value="locked">
          Locked
        </TabsTrigger>
      </TabsList>
      <TabsContent value="worlds">Your saved worlds appear here.</TabsContent>
      <TabsContent value="realms">Your realms appear here.</TabsContent>
      <TabsContent value="locked">You can't open this tab yet.</TabsContent>
    </Tabs>
  );
}
