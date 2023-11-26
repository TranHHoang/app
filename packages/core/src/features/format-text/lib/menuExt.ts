import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Editor, Extension, isNodeSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit, StarterKitOptions } from "@tiptap/starter-kit";
import { starterkitDefaultOptions } from "~/entities/editor-area";
import { FormatTextMenu } from "../ui/FormatTextMenu";

type FormatTextMenuStorage = Partial<{
  menuEl: HTMLElement;
  onCleanup: () => void;
  setEditor: (e: Editor) => void;
}>;

export const FormatTextMenuExt = Extension.create<Record<string, never>, FormatTextMenuStorage>({
  name: "formatTextMenu",

  onCreate() {
    this.storage.setEditor?.(this.editor);
  },

  onDestroy() {
    this.storage.onCleanup?.();
    this.storage.menuEl?.remove();
  },

  addExtensions() {
    const [editor, setEditor] = createSignal<Editor | null>(null);

    this.storage.menuEl = document.createElement("div");
    this.storage.onCleanup = render(() => FormatTextMenu({ editor }), this.storage.menuEl);
    this.storage.setEditor = setEditor;

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
        element: this.storage.menuEl.firstElementChild as HTMLElement,
        shouldShow: ({ state }) => {
          const { selection } = state;
          return !selection.empty && !isNodeSelection(selection);
        },
      }),
    ];
  },
});
