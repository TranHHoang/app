import { Component, createEffect, onCleanup } from "solid-js";
import { Editor } from "@tiptap/core";
import { useEditorExtensions } from "../model/extensionStore";

export const EditorArea: Component = () => {
  let ref: HTMLDivElement | undefined;
  const { extensions } = useEditorExtensions();

  createEffect(() => {
    const editor = new Editor({
      element: ref,
      extensions: extensions(),
      content: "This is content",
    });

    onCleanup(() => {
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
