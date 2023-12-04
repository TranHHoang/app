import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { wrappingInputRule } from "@tiptap/core";
import { BulletItem } from "../ui/BulletItem";
import { ListItemNode } from "./listItemNode";

export const BulletItemNode = ListItemNode.extend({
  name: "bulletItem",
  addInputRules() {
    const inputRegex = /^\s*([*+-])\s$/;
    const inputRule = wrappingInputRule({
      find: inputRegex,
      type: this.type,
      keepMarks: true,
      keepAttributes: true,
      getAttributes: () => {
        return this.editor.getAttributes("textStyle");
      },
      editor: this.editor,
    });
    return [inputRule];
  },
  addNodeView() {
    return SolidNodeViewRenderer(BulletItem);
  },
});
