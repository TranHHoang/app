import { Extension, isNodeSelection } from "@tiptap/core";
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit, StarterKitOptions } from "@tiptap/starter-kit";
import { render, RenderedComponent } from "~/shared/lib";
import { starterkitDefaultOptions } from "~/entities/editor-area";
import { FormatTextMenu } from "../ui/FormatTextMenu";

interface FormatTextMenuStorage {
  component: RenderedComponent | null;
}

export const FormatTextMenuExt = Extension.create<Record<string, never>, FormatTextMenuStorage>({
  name: "formatTextMenu",
  addStorage() {
    return {
      component: null,
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
    ];
  },
  addProseMirrorPlugins() {
    this.storage.component = render(FormatTextMenu, { editor: this.editor }, { detached: true });

    return [
      BubbleMenuPlugin({
        pluginKey: "formatTextMenu/bubbleMenu",
        editor: this.editor,
        element: this.storage.component.el,
        shouldShow: ({ state }) => {
          const { selection } = state;
          return !selection.empty && !isNodeSelection(selection);
        },
      }),
    ];
  },
  onDestroy() {
    this.storage.component?.cleanup();
    this.storage.component = null;
  },
});
