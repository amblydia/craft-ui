// Turns themes/craft.css into the `cssVars` and `css` fields of a registry item,
// so the CSS file stays the only place the theme is written down.

import postcss, { type AtRule, type ChildNode, type Rule } from "postcss";

export interface CssTree {
  [key: string]: string | CssTree;
}

export interface RegistryTheme {
  css: CssTree;
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
    theme: Record<string, string>;
  };
}

const collapse = (value: string) => value.replace(/\s+/gu, " ").trim();

function readVariables(node: Rule | AtRule) {
  const variables: Record<string, string> = {};
  node.each((child) => {
    if (child.type === "decl" && child.prop.startsWith("--")) {
      variables[child.prop.slice(2)] = collapse(child.value);
    }
  });
  return variables;
}

function readBlock(nodes: ChildNode[]) {
  const tree: CssTree = {};
  for (const node of nodes) {
    if (node.type === "decl") {
      tree[node.prop] = collapse(node.value);
    } else if (node.type === "rule") {
      tree[node.selector] = readBlock(node.nodes);
    } else if (node.type === "atrule") {
      tree[`@${node.name} ${node.params}`] = readBlock(node.nodes ?? []);
    }
  }
  return tree;
}

export function themeToRegistry(source: string): RegistryTheme {
  const theme: RegistryTheme = {
    css: {},
    cssVars: { dark: {}, light: {}, theme: {} },
  };

  for (const node of postcss.parse(source).nodes) {
    if (node.type === "rule" && node.selector === ":root") {
      theme.cssVars.light = readVariables(node);
    } else if (node.type === "rule" && node.selector === ".dark") {
      theme.cssVars.dark = readVariables(node);
    } else if (node.type === "atrule" && node.name === "theme") {
      theme.cssVars.theme = readVariables(node);
    } else if (node.type === "atrule") {
      theme.css[`@${node.name} ${node.params}`] = readBlock(node.nodes ?? []);
    } else if (node.type === "rule") {
      throw new Error(`Unexpected rule in the theme: ${node.selector}`);
    }
  }

  return theme;
}
