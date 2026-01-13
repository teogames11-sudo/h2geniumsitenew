"use client";

type MainShellProps = {
  children: React.ReactNode;
};

export const MainShell = ({ children }: MainShellProps) => {
  return (
    <main className="flex-1 pb-16 pt-[92px] sm:pt-[104px]">
      <div className="page-shell">{children}</div>
    </main>
  );
};
