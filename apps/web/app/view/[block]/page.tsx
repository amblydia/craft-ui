import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blockDemos } from "@/components/demos/blocks";

// A block on a page of its own, filling the window, as it would in an app.

interface Props {
  params: Promise<{ block: string }>;
}

export function generateStaticParams() {
  return Object.keys(blockDemos).map((block) => ({ block }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { block } = await props.params;
  return {
    // The docs pages are the ones to find in search.
    robots: { index: false },
    title: block
      .split("-")
      .map((word: string) => word[0]?.toUpperCase() + word.slice(1))
      .join(" "),
  };
}

export default async function View(props: Props) {
  const { block } = await props.params;
  const Demo = blockDemos[block];
  if (!Demo) {
    notFound();
  }
  return (
    <main className="flex h-dvh flex-col *:min-h-0 *:flex-1">
      <Demo />
    </main>
  );
}
