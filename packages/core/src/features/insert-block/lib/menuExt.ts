import { Extension } from "@tiptap/core";
import { StarterKit, StarterKitOptions } from "@tiptap/starter-kit";
import { Suggestion, SuggestionOptions } from "@tiptap/suggestion";
import { starterkitDefaultOptions } from "~/entities/editor-area";
import { MenuItem, menuItems } from "../model/menuItems";
import { renderMenu } from "./suggestion";

type SlashMenuOptions = Omit<SuggestionOptions<MenuItem>, "editor">;

export const SlashMenuExt = Extension.create<SlashMenuOptions>({
  name: "slashMenu",
  addOptions() {
    return {
      char: "/",
      command: ({ editor, range, props }): void => {
        props.onCommand({ editor, range });
      },
    };
  },
  addExtensions() {
    return [
      StarterKit.extend<StarterKitOptions>({
        name: "starterKitNode",
        addOptions() {
          return {
            ...starterkitDefaultOptions,
            heading: {},
            blockquote: {},
            bulletList: {},
            codeBlock: {},
            horizontalRule: {},
            listItem: {},
            orderedList: {},
          };
        },
      }),
    ];
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        ...this.options,
        editor: this.editor,
        items: ({ query }) => menuItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
        render: renderMenu,
      }),
    ];
  },
});
