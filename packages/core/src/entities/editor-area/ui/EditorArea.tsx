import { Component, createEffect, onCleanup, onMount } from "solid-js";
import { Editor } from "@tiptap/core";
import { usePlatformConfigs } from "~/shared/lib";
import { useEditorExtensions } from "../model/extensionStore";

interface EditorAreaProps {
  editor: Editor | null;
  onEditorChange: (e: Editor | null) => void;
}

export const EditorArea: Component<EditorAreaProps> = (props) => {
  let ref: HTMLDivElement | undefined;
  let fileName: string | null = null;

  const { extensions } = useEditorExtensions();
  const { openTextFile, saveTextFile } = usePlatformConfigs();

  async function handleKeydown(e: KeyboardEvent): Promise<void> {
    if (!e.ctrlKey || !props.editor) return;

    if (e.key === "o") {
      const file = await openTextFile();
      if (file) {
        fileName = file.name;
        props.editor.commands.setContent(file.content);
      }
    } else if (e.key === "s") {
      fileName = await saveTextFile(fileName, props.editor.getHTML().trim());
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

    onCleanup(() => {
      props.onEditorChange(null);
      editor.destroy();
    });
  });

  return (
    <>
      <div ref={ref} class="Editor" />
      <style jsx>{`
        .Editor {
          height: 100%;
          font-size: var(--text-base);
        }

        :deep() {
          .ProseMirror {
            outline: none;
            padding: 10px 30px;
            height: 100%;
            overflow: auto;

            > * {
              margin: 5px 0;
            }
          }

          :where(.ProseMirror:not(.dragging)) .ProseMirror-selectednode {
            background-color: var(--color-highlight);
          }
        }
      `}</style>
    </>
  );
};
