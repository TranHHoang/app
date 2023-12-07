import { Selection } from "@tiptap/pm/state";

interface SelectionInfo {
  startPos: number;
  endPos: number;
  lines: string[];
}

export function getSelectionInfo(selection: Selection): SelectionInfo {
  const { $from, $to } = selection;
  const content = $from.parent.textContent;

  // Find the first starting line position of the current selection
  let startPos = $from.parentOffset;
  while (startPos > 0 && content[startPos - 1] !== "\n") {
    startPos--;
  }

  let endPos = $to.parentOffset - 1;
  while (endPos + 1 < content.length && content[endPos + 1] !== "\n") {
    endPos++;
  }

  const lines = content.slice(startPos, endPos + 1).split("\n");
  const parentPos = $from.posAtIndex(0);

  return { startPos: parentPos + startPos, endPos: parentPos + endPos, lines };
}
