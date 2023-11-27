import { render } from "solid-js/web";
import { Extension, isNodeSelection } from "@tiptap/core";
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit, StarterKitOptions } from "@tiptap/starter-kit";
import { starterkitDefaultOptions } from "~/entities/editor-area";
import { FormatTextMenu } from "../ui/FormatTextMenu";

type FormatTextMenuStorage = Partial<{
  onMenuCleanup: () => void;
}>;

export const FormatTextMenuExt = Extension.create<Record<string, never>, FormatTextMenuStorage>({
  name: "formatTextMenu",
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
    ];
  },
  addProseMirrorPlugins() {
    const menuEl = document.createElement("div");
    this.storage.onMenuCleanup = render(() => FormatTextMenu({ editor: this.editor }), menuEl);

    return [
      BubbleMenuPlugin({
        pluginKey: "formatTextMenu/bubbleMenu",
        editor: this.editor,
        element: menuEl,
        shouldShow: ({ state }) => {
          const { selection } = state;
          return !selection.empty && !isNodeSelection(selection);
        },
      }),
    ];
  },
  onDestroy() {
    this.storage.onMenuCleanup?.();
  },
});
