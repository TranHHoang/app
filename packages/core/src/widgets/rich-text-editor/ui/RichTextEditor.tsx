import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Editor } from "@tiptap/core";
import { EditorArea, useEditorExtensions } from "~/entities/editor-area";
import { BlockDragHandleExt } from "~/features/drag-block";
import { FormatTextMenuExt } from "~/features/format-text";
import { SlashMenuExt } from "~/features/insert-block";
import { MiscExt } from "~/features/misc";

export const RichTextEditor: Component = () => {
  const [editor, setEditor] = createSignal<Editor | null>(null);
  const [showEditorArea, setShowEditorArea] = createSignal(false);

  onMount(() => {
    const extStore = useEditorExtensions();
    const exts = [FormatTextMenuExt, SlashMenuExt, BlockDragHandleExt, MiscExt];
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
