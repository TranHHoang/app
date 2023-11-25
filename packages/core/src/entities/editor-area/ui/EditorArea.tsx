import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Editor } from "@tiptap/core";
import { usePlatformConfigs } from "~/shared/lib";
import { useEditorExtensions } from "../model/extensionStore";

interface EditorAreaProps {
  onEditorChange: (e: Editor | null) => void;
}

export const EditorArea: Component<EditorAreaProps> = (props) => {
  let ref: HTMLDivElement | undefined;
  let fileName: string | null = null;

  const [editor, setEditor] = createSignal<Editor | null>(null);

  const { extensions } = useEditorExtensions();
  const { openTextFile, saveTextFile } = usePlatformConfigs();

  async function handleKeydown(e: KeyboardEvent): Promise<void> {
    const currentEditor = editor();
    if (!e.ctrlKey || !currentEditor) return;

    if (e.key === "o") {
      const file = await openTextFile();
      if (file) {
        fileName = file.name;
        currentEditor.commands.setContent(file.content);
      }
    } else if (e.key === "s") {
      fileName = await saveTextFile(fileName, currentEditor.getHTML().trim());
    }
  }

  onMount(() => {
    ref?.addEventListener("keydown", handleKeydown);
    onCleanup(() => {
      ref?.removeEventListener("keydown", handleKeydown);
    });
  });

  createEffect(() => {
    const editor = new Editor({
      element: ref,
      extensions: extensions(),
      content: "This is content",
    });
    props.onEditorChange(editor);
    setEditor(editor);

    onCleanup(() => {
      props.onEditorChange(null);
      setEditor(null);
      editor.destroy();
    });
  });

  return (
    <>
      <div ref={ref} class="Editor" />
      <style jsx>{`
        .Editor {
          margin: 5px;
          height: 100%;
          font-size: var(--text-base);
        }

        :deep() {
          .ProseMirror {
            outline: none;
            padding: 10px 30px;
            height: 100%;

            > * {
              margin: 5px 0;
            }
          }
        }
      `}</style>
    </>
  );
};
