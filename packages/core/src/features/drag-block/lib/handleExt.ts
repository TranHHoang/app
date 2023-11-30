import { ComponentProps } from "solid-js";
import { SolidRenderer } from "@app/tiptap-solid";
import { Editor, Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { BlockDragHandle } from "../ui/BlockDragHandle";
import { Dropcursor } from "./dropcursor";
import { nodeAtCoords } from "./utils";

interface BlockDragHandlePluginOptions {
  editor: Editor;
}

export const BlockDragHandleExt = Extension.create({
  name: "blockDragHandle",
  addExtensions() {
    return [Dropcursor];
  },
  addProseMirrorPlugins() {
    return [BlockDragHandlePlugin({ editor: this.editor })];
  },
});

function BlockDragHandlePlugin(options: BlockDragHandlePluginOptions): Plugin {
  let component: SolidRenderer<ComponentProps<typeof BlockDragHandle>> | null = null;

  function showHandle(): void {
    component?.element.classList.remove("hidden");
  }

  function hideHandle(): void {
    component?.element.classList.add("hidden");
  }

  return new Plugin({
    view(view) {
      component = new SolidRenderer(BlockDragHandle, {
        editor: options.editor,
        props: {
          view,
        },
      });
      document.body.append(component.element);
      hideHandle();

      return {
        destroy() {
          component?.destroy();
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

          const handleEl = component?.element as HTMLElement | undefined;
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
