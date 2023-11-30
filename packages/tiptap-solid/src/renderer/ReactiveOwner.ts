import { Owner } from "solid-js";
import type { Editor } from "@tiptap/core";

export const ReactiveOwnerProperty = Symbol("Reactive owner property used by tiptap solid as a workaround");

// Solid js doesn't expose Owner type
export const getTiptapSolidReactiveOwner = (editor: Editor): Owner | undefined =>
  (editor as unknown as Record<symbol, Owner>)[ReactiveOwnerProperty] ?? undefined;
