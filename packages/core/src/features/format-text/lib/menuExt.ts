import { ComponentProps } from "solid-js";
import { SolidRenderer } from "@app/tiptap-solid";
import { Extension, isNodeSelection } from "@tiptap/core";
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit, StarterKitOptions } from "@tiptap/starter-kit";
import { starterkitDefaultOptions } from "~/entities/editor-area";
import { FormatTextMenu } from "../ui/FormatTextMenu";

interface FormatTextMenuStorage {
  component: SolidRenderer<ComponentProps<typeof FormatTextMenu>> | null;
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
    this.storage.component = new SolidRenderer(FormatTextMenu, {
      editor: this.editor,
      props: { editor: this.editor },
    });

    return [
      BubbleMenuPlugin({
        pluginKey: "formatTextMenu/bubbleMenu",
        editor: this.editor,
        element: this.storage.component.element as HTMLElement,
        shouldShow: ({ state }) => {
          const { selection } = state;
          return !selection.empty && !isNodeSelection(selection);
        },
      }),
    ];
  },
  onDestroy() {
    this.storage.component?.destroy();
    this.storage.component = null;
  },
});
