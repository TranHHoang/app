// From: https://github.com/ueberdosis/tiptap/blob/develop/packages/extension-code-block-lowlight/src/lowlight-plugin.ts
import { findChildren } from "@tiptap/core";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Step } from "@tiptap/pm/transform";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Root, RootContent } from "hast";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

function parseNodes(nodes: RootContent[], className: string[] = []): { text: string; classes: string[] }[] {
  return nodes.flatMap((node) => {
    const classes = [...className, ...(node.type === "element" ? (node.properties.className as string[]) : [])];

    if (node.type === "element") {
      return parseNodes(node.children, classes);
    }

    return {
      text: node.type === "doctype" ? "" : node.value,
      classes,
    };
  });
}

function getHighlightNodes(result: Root): RootContent[] {
  return result.children;
}

function getDecorations({
  doc,
  name,
  lowlight,
  defaultLanguage,
}: {
  doc: ProsemirrorNode;
  name: string;
  lowlight: ReturnType<typeof createLowlight>;
  defaultLanguage: string | null | undefined;
}): DecorationSet {
  const decorations: Decoration[] = [];

  for (const block of findChildren(doc, (node) => node.type.name === name)) {
    let from = block.pos + 1;
    const language = (block.node.attrs.language as string) || defaultLanguage;
    const languages = lowlight.listLanguages();

    const nodes =
      language && (languages.includes(language) || lowlight.registered(language))
        ? getHighlightNodes(lowlight.highlight(language, block.node.textContent))
        : getHighlightNodes(lowlight.highlightAuto(block.node.textContent));

    for (const node of parseNodes(nodes)) {
      const to = from + node.text.length;

      if (node.classes.length > 0) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(" "),
        });

        decorations.push(decoration);
      }

      from = to;
    }
  }

  return DecorationSet.create(doc, decorations);
}

function hasFromTo(step: Step): step is Step & { from: number; to: number } {
  return "from" in step && "to" in step && typeof step.from === "number" && typeof step.to === "number";
}

export function LowlightPlugin({
  name,
  defaultLanguage,
}: {
  name: string;
  defaultLanguage?: string;
}): Plugin<DecorationSet> {
  const lowlightPlugin: Plugin<DecorationSet> = new Plugin<DecorationSet>({
    key: new PluginKey("lowlight"),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          lowlight,
          defaultLanguage,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(oldState.doc, (node) => node.type.name === name);
        const newNodes = findChildren(newState.doc, (node) => node.type.name === name);

        if (
          transaction.docChanged &&
          // Apply decorations if:
          // selection includes named node,
          ([oldNodeName, newNodeName].includes(name) ||
            // OR transaction adds/removes named node,
            newNodes.length !== oldNodes.length ||
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            transaction.steps.some((step) => {
              return (
                hasFromTo(step) &&
                oldNodes.some((node) => {
                  return node.pos >= step.from && node.pos + node.node.nodeSize <= step.to;
                })
              );
            }))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            lowlight,
            defaultLanguage,
          });
        }

        // eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return lowlightPlugin.getState(state);
      },
    },
  });

  return lowlightPlugin;
}
