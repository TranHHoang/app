import type { JSX, JSXElement, ValidComponent } from "solid-js";
import { Dynamic, DynamicProps } from "solid-js/web";
import { useSolidNodeView } from "./useSolidNodeView";

type NodeViewContentProps<T extends ValidComponent> = DynamicProps<T> & Pick<JSX.CustomAttributes<T>, "ref">;

export const NodeViewContent = <T extends ValidComponent>(
  props: NodeViewContentProps<T> | Omit<NodeViewContentProps<T>, "component">
): JSXElement => {
  const state = useSolidNodeView();

  return (
    <Dynamic
      {...props}
      component={props.component ?? "div"}
      ref={(ref: HTMLElement) => {
        state.nodeViewContentRef?.(ref);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (typeof props.ref === "function") props.ref(ref);
      }}
      data-node-view-content=""
      style={{
        ...props.style,
        "white-space": "pre-wrap",
      }}
    />
  );
};
