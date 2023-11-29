import { EditorView } from "@tiptap/pm/view";

export function nodePosAtDOM(node: Element, view: EditorView): number | null {
  const boundingRect = node.getBoundingClientRect();

  return (
    view.posAtCoords({
      left: boundingRect.left + 1,
      top: boundingRect.top + 1,
    })?.inside ?? null
  );
}

export function nodeAtCoords(coords: { x: number; y: number }, selectors: string): Element | null {
  return (
    document
      .elementsFromPoint(coords.x, coords.y)
      .find(
        (el) =>
          (el.parentElement?.matches(selectors) ?? false) ||
          el.matches(["li", "p:not(:first-child)", "pre", "blockquote", "h1, h2, h3, h4, h5, h6"].join(", "))
      ) ?? null
  );
}
