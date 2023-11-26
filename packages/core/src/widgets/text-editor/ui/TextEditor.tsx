import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Editor } from "@tiptap/core";
import { EditorArea, useEditorExtensions } from "~/entities/editor-area";
import { FormatTextMenuExt } from "~/features/format-text";

export const TextEditor: Component = () => {
  const [editor, setEditor] = createSignal<Editor | null>(null);
  const [showEditorArea, setShowEditorArea] = createSignal(false);

  onMount(() => {
    const extStore = useEditorExtensions();
    const exts = [FormatTextMenuExt];
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
    </>
  );
};
