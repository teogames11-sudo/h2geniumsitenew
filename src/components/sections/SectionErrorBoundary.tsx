"use client";

import type { ReactNode } from "react";
import { Component } from "react";

type SectionErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SectionErrorBoundaryState = {
  hasError: boolean;
};

export class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  public state: SectionErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Section render failed:", error);
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
