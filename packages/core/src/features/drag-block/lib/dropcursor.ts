import { Dropcursor as TiptapDropcursor } from "@tiptap/extension-dropcursor";
import "../ui/dropcursor.css";

export const Dropcursor = TiptapDropcursor.configure({
  class: "dropcursor",
  width: 2,
});
