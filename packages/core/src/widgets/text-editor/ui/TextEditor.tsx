import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Editor } from "@tiptap/core";
import { EditorArea, useEditorExtensions } from "~/entities/editor-area";
import { FormatTextMenu, FormatTextMenuExt } from "~/features/format-text";

type MenuRefs = Partial<{
  formatTextMenu: HTMLElement;
}>;

export const TextEditor: Component = () => {
  const menuRefs: MenuRefs = {};

  const [editor, setEditor] = createSignal<Editor | null>(null);
  const [showEditorArea, setShowEditorArea] = createSignal(false);

  onMount(() => {
    const extStore = useEditorExtensions();
    const exts = [FormatTextMenuExt.configure({ element: menuRefs.formatTextMenu })];
    extStore.add(exts);

    // Delay creating the editor area until all the menus have been initialized
    setShowEditorArea(true);

    onCleanup(() => {
      extStore.remove(exts);
    });
  });

  return (
    <>
      <Show when={showEditorArea()}>
        <EditorArea editor={editor()} onEditorChange={setEditor} />
      </Show>
      <FormatTextMenu editor={editor()} ref={(el) => (menuRefs.formatTextMenu = el)} />
    </>
  );
};
