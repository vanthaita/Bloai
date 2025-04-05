import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
  expanded = false,
}: {
  className?: string;
  children?: React.ReactNode;
  expanded?: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4 md:gap-5 lg:gap-6",
          "grid-cols-1 min-[375px]:grid-cols-1 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-2 min-[1440px]:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
};
