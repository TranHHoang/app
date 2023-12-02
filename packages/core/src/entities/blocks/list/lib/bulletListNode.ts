import { RawCommands } from "@tiptap/core";
import { ListNode } from "./listNode";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bulletList: {
      /**
       * Toggle a bullet list
       */
      toggleBulletList: () => ReturnType;
    };
  }
}

export const BulletListNode = ListNode.extend({
  name: "bulletList",
  content: "bulletItem+",
  parseHTML() {
    return [{ tag: "ul" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["ul", HTMLAttributes, 0];
  },
  addCommands(): Partial<RawCommands> {
    return {
      toggleBulletList: () => {
        return ({ commands }) => {
          return commands.toggleList(this.name, "bulletItem", true);
        };
      },
    };
  },
});
