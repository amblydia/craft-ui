import { ProfileScreen } from "@/components/craft/blocks/profile-screen";
import { Button } from "@/components/craft/button";
import { Explorer, GameArt, Scene } from "@/components/demos/game-art";

export function ProfileScreenDemo() {
  return (
    <ProfileScreen
      actions={<Button variant="secondary">Dressing room</Button>}
      background={<Scene name="night" />}
      completed={[
        {
          description: "Light up a cave with twenty torches",
          icon: <GameArt name="torch" />,
          id: "lights",
          points: 20,
          title: "Bright Ideas",
        },
        {
          description: "Bake your first loaf of bread",
          icon: <GameArt name="bread" />,
          id: "baker",
          points: 10,
          title: "Fresh From the Oven",
        },
      ]}
      details={[
        { label: "Joined", value: "March 2021" },
        { label: "Favorite mode", value: "Survival" },
        { label: "Time played", value: "412 hours" },
      ]}
      profile={{
        avatarFallback: "SK",
        name: "Skylark",
        preview: (
          <div className="flex size-full items-end justify-center p-4">
            <Explorer />
          </div>
        ),
        status: "online",
      }}
      stats={[
        { icon: <GameArt name="bread" />, label: "Friends", value: "3" },
        { label: "Followers", value: "230" },
        {
          detail: "2,950 / 2,960",
          icon: <GameArt name="gem" />,
          label: "Achievements",
          value: "130 / 131",
          wide: true,
        },
      ]}
      suggested={[
        {
          description: "Find a sea gem deep underground",
          icon: <GameArt name="gem" />,
          id: "gem",
          points: 10,
          title: "Shine Bright",
        },
      ]}
    />
  );
}
