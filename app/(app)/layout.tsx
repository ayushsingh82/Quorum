import type { ReactNode } from "react";
import QuorumShell from "../components/QuorumShell";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <QuorumShell>{children}</QuorumShell>;
}
