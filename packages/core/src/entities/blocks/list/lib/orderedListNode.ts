import { RawCommands } from "@tiptap/core";
import { ListNode } from "./listNode";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    orderedList: {
      /**
       * Toggle an ordered list
       */
      toggleOrderedList: () => ReturnType;
    };
  }
}

export const OrderedListNode = ListNode.extend({
  name: "orderedList",
  content: "orderedItem+",
  parseHTML() {
    return [{ tag: "ol" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["ol", HTMLAttributes, 0];
  },
  addCommands(): Partial<RawCommands> {
    return {
      toggleOrderedList: () => {
        return ({ commands }) => {
          return commands.toggleList(this.name, "orderedItem", true);
        };
      },
    };
  },
});
