import type { Component, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSolidNodeView } from "./useSolidNodeView";

export interface NodeViewWrapperProps {
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  as?: ValidComponent;
  style?: Record<string, string>;
}

export const NodeViewWrapper: Component<NodeViewWrapperProps> = (props) => {
  const { onDragStart } = useSolidNodeView();

  return (
    <Dynamic
      component={props.as ?? "div"}
      {...props}
      data-node-view-wrapper=""
      onDragStart={onDragStart}
      style={{
        ...props.style,
        "white-space": "normal",
      }}
    />
  );
};
