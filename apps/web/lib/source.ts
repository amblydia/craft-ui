import { loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { docsRoute } from "./shared";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // Shiki's default GitHub themes fall short of AA on CraftUI's surfaces.
    mdxOptions: applyMdxPreset({
      rehypeCodeOptions: {
        themes: {
          dark: "github-dark-high-contrast",
          light: "github-light-high-contrast",
        },
      },
    }),
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
});
