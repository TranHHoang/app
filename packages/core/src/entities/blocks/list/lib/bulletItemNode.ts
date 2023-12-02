import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { BulletItem } from "../ui/BulletItem";
import { ListItemNode } from "./listItemNode";

export const BulletItemNode = ListItemNode.extend({
  name: "bulletItem",
  addNodeView() {
    return SolidNodeViewRenderer(BulletItem);
  },
});
