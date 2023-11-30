import type { Component, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSolidNodeView } from "./useSolidNodeView";

export interface NodeViewContentProps {
  style?: Record<string, string>;
  as?: ValidComponent;
}

export const NodeViewContent: Component<NodeViewContentProps> = (props) => {
  const state = useSolidNodeView();

  return (
    <Dynamic
      component={props.as ?? "div"}
      {...props}
      ref={state.nodeViewContentRef}
      data-node-view-content=""
      style={{
        ...props.style,
        "white-space": "pre-wrap",
      }}
    />
  );
};
