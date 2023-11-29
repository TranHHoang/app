import { render } from "solid-js/web";
import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { BlockDragHandle } from "../ui/BlockDragHandle";
import { Dropcursor } from "./dropcursor";
import { nodeAtCoords } from "./utils";

function BlockDragHandlePlugin(): Plugin {
  const dragHandleEl = document.createElement("div");

  function showHandle(): void {
    dragHandleEl.firstElementChild?.classList.remove("hidden");
  }

  function hideHandle(): void {
    dragHandleEl.firstElementChild?.classList.add("hidden");
  }

  return new Plugin({
    view(view) {
      document.body.append(dragHandleEl);

      const cleanup = render(() => BlockDragHandle({ view }), dragHandleEl);
      hideHandle();

      return {
        destroy() {
          cleanup();
          dragHandleEl.remove();
        },
      };
    },
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          if (!view.editable) return;

          const node = nodeAtCoords({ x: event.clientX + 30, y: event.clientY }, ".ProseMirror");
          if (!(node instanceof Element)) {
            hideHandle();
            return;
          }

          const compStyle = window.getComputedStyle(node);
          const lineHeight = Number.parseInt(compStyle.lineHeight);
          const paddingTop = Number.parseInt(compStyle.paddingTop);

          const rect = node.getBoundingClientRect();

          const handleEl = dragHandleEl.firstElementChild as HTMLElement;

          handleEl.style.left = `${rect.left - 20}px`;
          handleEl.style.top = `${rect.top + (lineHeight - 24) / 2 + paddingTop}px`;
          showHandle();
        },
        dragstart(view) {
          view.dom.classList.add("dragging");
        },
        drop(view) {
          view.dom.classList.remove("dragging");
        },
        dragend(view) {
          view.dom.classList.remove("dragging");
        },
      },
    },
  });
}

export const BlockDragHandleExt = Extension.create({
  name: "blockDragHandle",
  addExtensions() {
    return [Dropcursor];
  },
  addProseMirrorPlugins() {
    return [BlockDragHandlePlugin()];
  },
});
