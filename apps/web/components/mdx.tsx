import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { ComponentPreview } from "@/components/component-preview";

const generator = createGenerator({
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
});

// Builds a props table from a component's TypeScript types, so it can't drift.
function TypeTable(
  props: Omit<ComponentProps<typeof AutoTypeTable>, "generator">
) {
  return (
    <AutoTypeTable
      {...props}
      generator={generator}
      shiki={{
        themes: {
          dark: "github-dark-high-contrast",
          light: "github-light-high-contrast",
        },
      }}
    />
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    AutoTypeTable: TypeTable,
    ComponentPreview,
    Tab,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
