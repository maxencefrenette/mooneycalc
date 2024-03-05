"use client";

import type React from "react";
import { useIsClient } from "@uidotdev/usehooks";

export function ClientOnly({ children }: React.PropsWithChildren) {
  if (useIsClient() === false) return null;
  return children;
}
