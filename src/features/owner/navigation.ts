import { BarChart3, FileText, Images, Inbox, LayoutDashboard, Phone, Search, Sparkles, Stethoscope } from "lucide-react";
import type { NavItem } from "@/components/layout";

export const ownerNav: NavItem[] = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/pages", label: "Pages", icon: FileText },
  { to: "/owner/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/owner/services", label: "Services", icon: Sparkles },
  { to: "/owner/gallery", label: "Gallery", icon: Images },
  { to: "/owner/leads", label: "Leads", icon: Inbox },
  { to: "/owner/contact", label: "Contact & hours", icon: Phone },
  { to: "/owner/seo", label: "SEO", icon: Search },
  { to: "/owner/analytics", label: "Analytics", icon: BarChart3 },
];
