import { Component } from "solid-js";
import { createEditorExtensions, EditorExtensionsCtx } from "~/entities/editor-area";
import { TextEditor } from "~/widgets/text-editor";

export const App: Component = () => {
  const extensions = createEditorExtensions();

  return (
    <EditorExtensionsCtx.Provider value={extensions}>
      <TextEditor />
    </EditorExtensionsCtx.Provider>
  );
};
