import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { Editor } from "@tiptap/core";
import { MarkType, NodeType } from "@tiptap/pm/model";

export function useEditorActive(
  editor: Accessor<Editor>,
  name: Accessor<string>,
  attributes?: Record<string, never>
): () => boolean {
  return createEditorTransaction(editor, () => editor().isActive(name(), attributes));
}

export function useEditorAttributes(
  editor: Accessor<Editor>,
  nameOrType: Accessor<string | MarkType | NodeType>
): () => Record<string, unknown> {
  return createEditorTransaction(editor, () => editor().getAttributes(nameOrType()));
}

function createEditorTransaction<T>(editor: Accessor<Editor>, fn: () => T): () => T {
  const [dep, update] = createSignal(undefined, { equals: false });

  function forceUpdate(): void {
    // From: https://github.com/ueberdosis/tiptap/blob/develop/packages/react/src/useEditor.ts#L105
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        update();
      });
    });
  }

  createEffect(() => {
    editor().on("transaction", forceUpdate);
    onCleanup(() => {
      editor().off("transaction", forceUpdate);
    });
  });

  // eslint-disable-next-line solid/reactivity
  return () => {
    dep();
    return fn();
  };
}
