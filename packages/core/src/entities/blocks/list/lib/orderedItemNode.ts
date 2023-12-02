import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { OrderedItem } from "../ui/OrderedItem";
import { ListItemNode } from "./listItemNode";

export const OrderedItemNode = ListItemNode.extend({
  name: "orderedItem",
  addNodeView() {
    return SolidNodeViewRenderer(OrderedItem);
  },
});
