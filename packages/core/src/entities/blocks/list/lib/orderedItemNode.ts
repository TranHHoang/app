import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { wrappingInputRule } from "@tiptap/core";
import { OrderedItem } from "../ui/OrderedItem";
import { ListItemNode } from "./listItemNode";

export const OrderedItemNode = ListItemNode.extend({
  name: "orderedItem",
  addInputRules() {
    const inputRegex = /^(\d+)\.\s$/;
    const inputRule = wrappingInputRule({
      find: inputRegex,
      type: this.type,
      keepMarks: true,
      keepAttributes: true,
      getAttributes: (match) => ({ start: Number(match[1]), ...this.editor.getAttributes("textStyle") }),
      joinPredicate: (match, node) => node.childCount + node.attrs.start === Number(match[1]),
      editor: this.editor,
    });
    return [inputRule];
  },
  addNodeView() {
    return SolidNodeViewRenderer(OrderedItem);
  },
});
