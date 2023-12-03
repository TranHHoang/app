import { SolidNodeViewRenderer } from "@app/tiptap-solid";
import { Node } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { Divider } from "../ui/Divider";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    horizontalRule: {
      /**
       * Add a horizontal rule
       */
      setHorizontalRule: () => ReturnType;
    };
  }
}

export const DividerNode = Node.create({
  name: "divider",
  group: "block",
  defining: true,
  selectable: false,
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["hr", HTMLAttributes];
  },
  addCommands() {
    return {
      setHorizontalRule: () => {
        return ({ chain, state }) => {
          const { $to: $originTo } = state.selection;

          const currentChain = chain();

          if ($originTo.parentOffset === 0) {
            currentChain.insertContentAt(Math.max($originTo.pos - 2, 0), { type: this.name });
          } else {
            currentChain.insertContent({ type: this.name });
          }

          return (
            currentChain
              // set cursor after horizontal rule
              .command(({ editor, tr, dispatch }) => {
                if (dispatch) {
                  const { $to } = tr.selection;
                  const posAfter = $to.end();

                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1));
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos));
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                    }
                  } else {
                    // add node after horizontal rule if it’s the end of the document
                    const node = editor.schema.nodes.paragraph?.create();
                    if (node) {
                      tr.insert(posAfter + 2, node);
                      tr.setSelection(TextSelection.create(tr.doc, posAfter + 3));
                    }
                  }

                  tr.scrollIntoView();
                }

                return true;
              })
              .run()
          );
        };
      },
    };
  },
  addNodeView() {
    return SolidNodeViewRenderer(Divider);
  },
});
