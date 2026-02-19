"use client";

type MainShellProps = {
  children: React.ReactNode;
};

export const MainShell = ({ children }: MainShellProps) => {
  return (
    <main className="flex-1 pb-[calc(96px+env(safe-area-inset-bottom))] pt-[calc(92px+env(safe-area-inset-top))] sm:pb-[calc(112px+env(safe-area-inset-bottom))] sm:pt-[calc(104px+env(safe-area-inset-top))]">
      <div className="page-shell">{children}</div>
    </main>
  );
};
