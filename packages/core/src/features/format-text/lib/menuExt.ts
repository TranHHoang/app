import { Extension, isNodeSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit, StarterKitOptions } from "@tiptap/starter-kit";
import { starterkitDefaultOptions } from "~/entities/editor-area";

interface FormatTextMenuOptions {
  element: HTMLElement | null;
}

export const FormatTextMenuExt = Extension.create<FormatTextMenuOptions>({
  name: "formatTextMenu",

  addOptions() {
    return {
      element: null,
    };
  },

  addExtensions() {
    return [
      StarterKit.extend<StarterKitOptions>({
        name: "starterKitMark",
        addOptions() {
          return {
            ...starterkitDefaultOptions,
            bold: {},
            italic: {},
            strike: {},
            code: {},
          };
        },
      }),
      Underline,
      BubbleMenu.configure({
        pluginKey: "formatTextMenu/bubbleMenu",
        element: this.options.element,
        shouldShow: ({ state }) => {
          const { selection } = state;
          return !selection.empty && !isNodeSelection(selection);
        },
      }),
    ];
  },
});
