import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { Attributes, mergeAttributes } from "@tiptap/core";
import { TaskItem } from "../ui/TaskItem";
import { ListItemNode } from "./listItemNode";

export const TaskItemNode = ListItemNode.extend({
  name: "taskItem",
  addAttributes(): Attributes {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => element.dataset.checked === "true",
        renderHTML: (attributes) => ({
          "data-checked": attributes.checked as unknown,
        }),
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(HTMLAttributes, { "data-type": this.name, "data-checked": node.attrs.checked as unknown }),
      0,
    ];
  },
  addNodeView() {
    return SolidNodeViewRenderer(TaskItem);
  },
});
