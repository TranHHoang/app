import { mergeAttributes, RawCommands } from "@tiptap/core";
import { ListNode } from "./listNode";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskList: {
      /**
       * Toggle a task list
       */
      toggleTaskList: () => ReturnType;
    };
  }
}

export const TaskListNode = ListNode.extend({
  name: "taskList",
  content: "taskItem+",
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(HTMLAttributes, { "data-type": this.name }), 0];
  },
  addCommands(): Partial<RawCommands> {
    return {
      toggleTaskList: () => {
        return ({ commands }) => {
          return commands.toggleList(this.name, "taskItem", true);
        };
      },
    };
  },
});
