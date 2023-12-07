import { Placeholder as TiptapPlaceholder } from "@tiptap/extension-placeholder";
import "../ui/placeholder.css";

export const Placeholder = TiptapPlaceholder.configure({
  includeChildren: true,
  placeholder: ({ node }) => {
    switch (node.type.name) {
      case "heading": {
        return `Heading ${node.attrs.level}`;
      }
      case "codeBlock": {
        return "";
      }
      default: {
        return "Press '/' for commands...";
      }
    }
  },
});
