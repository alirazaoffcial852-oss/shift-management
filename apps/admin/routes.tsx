import {
  UserCog,
  User,
  Boxes,
  FolderKey,
  PersonStanding,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { NavLinks } from "./types/navLinks.interface";

export const NAV_ITEMS: NavLinks[] = [
  {
    label: "Dashboard",
    labelSmall: "Cust",
    href: "/dashboard",
    alternate: [],
    icon: <LayoutDashboard />,
  },
  {
    label: "Customers",
    labelSmall: "Cust",
    href: "/customers",
    alternate: ["/customers/add"],
    icon: <User />,
  },
  {
    label: "Products",
    labelSmall: "Prod",
    href: "/products",
    alternate: ["/products/add"],
    icon: <Boxes />,
  },
  {
    label: "Bv Projects",
    labelSmall: "Proj",
    href: "/bv-projects",
    alternate: ["/bv-projects/add"],
    icon: <FolderKey />,
  },
  {
    label: "Projects",
    labelSmall: "Proj",
    href: "/projects",
    alternate: ["/projects/add"],
    icon: <FolderKey />,
  },
  {
    label: "Employees",
    labelSmall: "Empl",
    href: "/employees",
    alternate: ["/employees/add"],
    icon: <PersonStanding />,
  },
  {
    label: "Train",
    labelSmall: "Trains",
    href: "/locomotives",
    alternate: ["/locomotives/add"],
    icon: <PersonStanding />,
  },
  {
    label: "Setting",
    labelSmall: "Cust",
    href: "/dashboard",
    alternate: [],
    icon: <Settings />,
  },
];
