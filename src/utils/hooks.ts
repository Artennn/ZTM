import { type RefObject, useEffect } from "react";

export const useScrollAndExpand = (
  ref: RefObject<HTMLDivElement>,
  selected: boolean,
  expanded?: boolean,
  setExpanded?: (newState: boolean) => void
) => {
  useEffect(() => {
    // got selected, should scroll to it (and expand)
    if (selected && !expanded) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return setExpanded && setExpanded(true);
    }

    // got unselected, should shrink
    if (!selected && expanded) {
      return setExpanded && setExpanded(false);
    }
  }, [selected]);

  return null;
};
