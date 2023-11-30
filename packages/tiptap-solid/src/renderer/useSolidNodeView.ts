import { createContext, useContext } from "solid-js";

export interface SolidNodeViewContextProps {
  onDragStart: (event: DragEvent) => void;
  nodeViewContentRef: (element: HTMLElement | null) => void;
}

export const SolidNodeViewContext = createContext<Partial<SolidNodeViewContextProps>>({
  onDragStart: undefined,
});

export function useSolidNodeView(): Partial<SolidNodeViewContextProps> {
  return useContext(SolidNodeViewContext);
}
