import { Component } from "solid-js";
import { NodeViewContent } from "@app/tiptap-solid";

export const BulletItem: Component = () => {
  return (
    <div data-type="listItem" class="ListItem" draggable="true">
      <div class="leading" />
      <NodeViewContent class="content" />
      <style jsx>{`
        .ListItem {
          display: flex;
        }

        .content {
          padding-left: 15px;

          > :deep(.List) {
            counter-increment: ul-counter;
          }
        }

        :global(@counter-style unordered-list) {
          system: fixed;
          symbols: "•" "◦";
        }

        .leading::before {
          content: counter(ul-counter, unordered-list);
          font-size: 1em;
          line-height: 1;
        }
      `}</style>
    </div>
  );
};
