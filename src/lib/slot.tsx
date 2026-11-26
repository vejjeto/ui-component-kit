import * as React from "react";
import { cn } from "./cn";

type AnyProps = Record<string, unknown>;

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];

    if (key === "className") {
      merged[key] = cn(
        typeof slotVal === "string" ? slotVal : undefined,
        typeof childVal === "string" ? childVal : undefined,
      );
    } else if (
      key === "style" &&
      typeof slotVal === "object" &&
      slotVal !== null &&
      typeof childVal === "object" &&
      childVal !== null
    ) {
      merged[key] = { ...(slotVal as object), ...(childVal as object) };
    } else if (
      /^on[A-Z]/.test(key) &&
      typeof slotVal === "function" &&
      typeof childVal === "function"
    ) {
      merged[key] = (...args: unknown[]) => {
        (childVal as (...a: unknown[]) => void)(...args);
        (slotVal as (...a: unknown[]) => void)(...args);
      };
    }
  }

  return merged;
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/** Lightweight composition primitive for `asChild` prop forwarding without external dependencies. */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!React.isValidElement<AnyProps>(children)) {
    return null;
  }

  const childElement = children as React.ReactElement<AnyProps> & {
    ref?: React.Ref<HTMLElement>;
  };
  const merged = mergeProps(slotProps, childElement.props);
  merged.ref = mergeRefs(forwardedRef, childElement.ref);

  return React.cloneElement(childElement, merged);
});
