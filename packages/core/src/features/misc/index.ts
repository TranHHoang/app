import { Extension } from "@tiptap/core";
import { Placeholder } from "./lib/placeholder";

export const MiscExt = Extension.create({
  name: "misc",
  addExtensions() {
    return [Placeholder];
  },
});
