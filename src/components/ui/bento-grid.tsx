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
        {
          // Expanded layout (sidebar closed)
          "grid-cols-1 min-[375px]:grid-cols-1 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1440px]:grid-cols-4": expanded,
          // Normal layout (sidebar open)
          "grid-cols-1 min-[375px]:grid-cols-1 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-2 min-[1440px]:grid-cols-3": !expanded
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  children
}: {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl transition duration-200 bg-white flex flex-col space-y-4",
        className
      )}
    >
      {header}
     
      <div className="flex-1">
        <div className="font-sans text-2xl font-semibold text-neutral-800 mb-1 hover:underline cursor-pointer">
          {title}
        </div>
        <div className="font-sans text-xs text-neutral-500">
          {description}
        </div>
      </div>
      {children}
    </div>
  );
};