import { Component } from "solid-js";
import { NodeSelection } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { Icon } from "~/shared/ui/icons";
import { nodeAtCoords, nodePosAtDOM } from "../lib/utils";

interface BlockDragHandleProps {
  view: EditorView;
}

export const BlockDragHandle: Component<BlockDragHandleProps> = (props) => {
  function onClick(e: MouseEvent): void {
    props.view.focus();

    const node = nodeAtCoords({ x: e.clientX + 50, y: e.clientY }, ".ProseMirror");
    if (!(node instanceof Element)) return;

    const nodePos = nodePosAtDOM(node, props.view);
    if (nodePos == null || nodePos < 0) return;

    props.view.dispatch(props.view.state.tr.setSelection(NodeSelection.create(props.view.state.doc, nodePos)));
  }

  function onDrag(e: DragEvent): void {
    props.view.focus();
    if (!e.dataTransfer) return;

    const node = nodeAtCoords({ x: e.clientX + 50, y: e.clientY }, ".ProseMirror");
    if (!(node instanceof Element)) return;

    const nodePos = nodePosAtDOM(node, props.view);
    if (nodePos == null || nodePos < 0) return;

    props.view.dispatch(props.view.state.tr.setSelection(NodeSelection.create(props.view.state.doc, nodePos)));

    const slice = props.view.state.selection.content();
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setDragImage(node, 0, 0);
    props.view.dragging = { slice, move: e.ctrlKey };
  }

  return (
    <div draggable="true" class="BlockDragHandle" onDragStart={onDrag}>
      <Icon.DragHandle class="icon" onClick={onClick} />
      <style jsx>{`
        .BlockDragHandle {
          position: absolute;
          opacity: 0.5;
          cursor: grab;
        }

        .icon {
          font-size: 1rem;

          &:hover {
            border-radius: var(--radius);
            background-color: var(--bg-button-hover);
          }
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  );
};
