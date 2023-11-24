import { Component, createSignal, Show } from "solid-js";
import { Editor } from "@tiptap/core";
import { EditorArea } from "~/entities/editor-area";
import { FormatTextMenu } from "~/features/format-text";

export const TextEditor: Component = () => {
  const [editor, setEditor] = createSignal<Editor | null>(null);

  return (
    <>
      <EditorArea onEditorChange={setEditor} />
      <Show when={editor()}>{(editor) => <FormatTextMenu editor={editor()} />}</Show>
    </>
  );
};
