import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { render, RenderedComponent } from "~/shared/lib";
import { BlockDragHandle } from "../ui/BlockDragHandle";
import { Dropcursor } from "./dropcursor";
import { nodeAtCoords } from "./utils";

function BlockDragHandlePlugin(): Plugin {
  let component: RenderedComponent | null = null;

  function showHandle(): void {
    component?.el.classList.remove("hidden");
  }

  function hideHandle(): void {
    component?.el.classList.add("hidden");
  }

  return new Plugin({
    view(view) {
      component = render(BlockDragHandle, { view });
      hideHandle();

      return {
        destroy() {
          component?.cleanup();
        },
      };
    },
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          if (!view.editable) return;

          const node = nodeAtCoords({ x: event.clientX + 30, y: event.clientY }, ".ProseMirror");
          if (!(node instanceof Element) || node.matches("ul, ol")) {
            hideHandle();
            return;
          }

          const compStyle = window.getComputedStyle(node);
          const lineHeight = Number.parseInt(compStyle.lineHeight);
          const paddingTop = Number.parseInt(compStyle.paddingTop);

          const rect = node.getBoundingClientRect();
          let left = rect.left - 20;
          if (node.matches("ul:not([data-type=taskList]) li, ol li")) {
            left -= 20;
          }

          const handleEl = component?.el;
          if (!handleEl) return;

          handleEl.style.left = `${left}px`;
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
