import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { Node } from "@tiptap/core";
import { List } from "../ui/List";

export const ListNode = Node.create({
  name: "list",
  group: "block list",
  content: "listItem+",
  addNodeView() {
    return SolidNodeViewRenderer(List);
  },
});
