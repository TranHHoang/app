import { Component } from "solid-js";
import { NodeViewContent } from "@app/tiptap-solid";

export const OrderedItem: Component = () => {
  return (
    <div data-type="listItem" class="ListItem" draggable="true">
      <div class="leading" />
      <NodeViewContent class="content" component="div" />
      <style jsx>{`
        .ListItem {
          display: flex;
        }

        .leading::before {
          counter-increment: ol-counter;
          content: counter(ol-counter) ".";
        }

        .content {
          padding-left: 10px;
        }
      `}</style>
    </div>
  );
};
