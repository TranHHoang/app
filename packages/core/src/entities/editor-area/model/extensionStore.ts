import { Accessor, createContext, createSignal, useContext } from "solid-js";
import { Extensions } from "@tiptap/core";
import { StarterKit, type StarterKitOptions } from "@tiptap/starter-kit";

export const starterkitDefaultOptions: StarterKitOptions = {
  blockquote: false,
  bold: false,
  bulletList: false,
  codeBlock: false,
  dropcursor: false,
  gapcursor: false,
  hardBreak: false,
  heading: false,
  horizontalRule: false,
  italic: false,
  listItem: false,
  orderedList: false,
  strike: false,
  code: false,
  document: false,
  history: false,
  paragraph: false,
  text: false,
};

interface EditorExtensions {
  extensions: Accessor<Extensions>;
  add: (exts: Extensions) => void;
  remove: (exts: Extensions) => void;
}

export function createEditorExtensions(): EditorExtensions {
  const [extensions, setExtensions] = createSignal<Extensions>([
    StarterKit.configure({
      ...starterkitDefaultOptions,
      document: undefined,
      history: undefined,
      paragraph: undefined,
      text: undefined,
    }),
  ]);

  function add(exts: Extensions): void {
    setExtensions([...extensions(), ...exts]);
  }

  function remove(exts: Extensions): void {
    setExtensions(extensions().filter((ext) => !exts.includes(ext)));
  }

  return { extensions, add, remove };
}

export const EditorExtensionsCtx = createContext<EditorExtensions>();

export function useEditorExtensions(): EditorExtensions {
  const ctx = useContext(EditorExtensionsCtx);
  if (!ctx) throw new Error("useEditorExtensions must be used within EditorExtensionsProvider");
  return ctx;
}
