import { Component } from "solid-js";
import { NodeViewContent } from "@app/tiptap-solid";

export const List: Component = () => {
  return (
    <>
      <NodeViewContent data-type="list" class="List" />
      <style jsx>{`
        .List {
          counter-reset: ol-counter ul-counter 1;
        }
      `}</style>
    </>
  );
};
