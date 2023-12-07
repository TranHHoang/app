import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { CodeBlock as TiptapCodeBlock } from "@tiptap/extension-code-block";
import { CodeBlock } from "../ui/CodeBlock";
import { LowlightPlugin } from "./lowlightPlugin";
import { getSelectionInfo } from "./utils";

const TAB_CHAR = "  ";
const TAB_SIZE = TAB_CHAR.length;

export const CodeBlockNode = TiptapCodeBlock.extend({
  name: "codeBlock",
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (!this.editor.isActive(this.name)) return false;

        const chain = this.editor.chain();
        const { startPos, lines } = getSelectionInfo(this.editor.state.selection);
        // Insert tabs for each line
        let pos = startPos;
        for (const line of lines) {
          chain.insertContentAt(pos, TAB_CHAR);
          // Go to the next line
          pos += line.length + 1 + TAB_SIZE;
        }
        // Keep the selection in sync with the new content
        const { $from, $to } = this.editor.state.selection;
        chain.setTextSelection({ from: $from.pos + TAB_SIZE, to: $to.pos + TAB_SIZE * lines.length });
        return chain.run();
      },
      "Shift-Tab": () => {
        if (!this.editor.isActive(this.name)) return false;

        const chain = this.editor.chain();
        const { endPos, lines } = getSelectionInfo(this.editor.state.selection);

        let pos = endPos + 1;
        for (const line of lines.toReversed()) {
          pos -= line.length; // Reset pos to the start of line
          const tabSize = Math.min(TAB_SIZE, line.length - line.trimStart().length);
          const range = { from: pos, to: pos + tabSize };
          chain.deleteRange(range);
          pos--; // Go to the previous line
        }
        return chain.run();
      },
      "Mod-a": () => {
        if (!this.editor.isActive(this.name)) return false;
        const { $from } = this.editor.state.selection;
        const from = $from.posAtIndex(0);

        // Select all code
        return this.editor.commands.setTextSelection({
          from,
          to: from + $from.parent.content.size,
        });
      },
    };
  },
  addCommands() {
    return {
      setCodeBlock: (attributes) => {
        return ({ commands }) => {
          return commands.setNode(this.name, attributes);
        };
      },
      toggleCodeBlock: (attributes) => {
        return ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", { language: attributes?.language ?? "javascript" });
        };
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      LowlightPlugin({
        name: this.name,
      }),
    ];
  },
  addNodeView() {
    return SolidNodeViewRenderer(CodeBlock);
  },
});
