import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

type Props = {
  label: string;
  icon?: LucideIcon;
  href: string;
  className?: string;
};

const Link = ({ label, href, icon: Icon, className }: Props) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `w-full min-w-full group flex gap-1 my-1 text-muted-foreground font-medium rounded-md items-center justify-start py-1 px-2 hover:bg-primary/5 hover:text-black hover:cursor-pointer relative  ${className ?? ""} ${
          isActive ? "bg-primary/5 text-black" : ""
        }`
      }
    >
      {Icon && <Icon className="h-[18px]" />}
      <div className="flex-auto whitespace-nowrap min-w-0 overflow-hidden text-clip flex items-center">
        <div className="whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </div>
      </div>
    </NavLink>
  );
};

export default Link;
