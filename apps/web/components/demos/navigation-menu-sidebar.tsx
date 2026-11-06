import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/craft/navigation-menu";

export function NavigationMenuSidebar() {
  return (
    <NavigationMenu
      aria-label="Settings"
      className="max-w-72"
      orientation="vertical"
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink active href="#accessibility">
            Accessibility
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuLabel>Controls</NavigationMenuLabel>
        <NavigationMenuItem>
          <NavigationMenuLink href="#keyboard">
            Keyboard &amp; Mouse
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Touch</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#layout">Layout</NavigationMenuLink>
            <NavigationMenuLink href="#sensitivity">
              Sensitivity
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuLabel>General</NavigationMenuLabel>
        <NavigationMenuItem>
          <NavigationMenuLink href="#video">Video</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#audio">Audio</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
