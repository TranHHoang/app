import { mergeAttributes, Node } from "@tiptap/core";

export const ListItemNode = Node.create({
  content: "paragraph block*",
  defining: true,
  parseHTML() {
    return [{ tag: `li[data-type="${this.name}"]`, priority: 51 }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["li", mergeAttributes(HTMLAttributes, { "data-type": this.name }), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
    };
  },
});
