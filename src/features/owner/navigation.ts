import { BarChart3, FileText, Images, Inbox, LayoutDashboard, MonitorSmartphone, Phone, Search, Settings, Sparkles, Stethoscope } from "lucide-react";
import type { NavItem } from "@/components/layout";

export const ownerNav: NavItem[] = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/pages", label: "My website", icon: FileText },
  { to: "/owner/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/owner/services", label: "Services", icon: Sparkles },
  { to: "/owner/gallery", label: "Gallery", icon: Images },
  { to: "/owner/leads", label: "Leads", icon: Inbox },
  { to: "/owner/contact", label: "Business details", icon: Phone },
  { to: "/owner/seo", label: "SEO", icon: Search },
  { to: "/owner/preview", label: "Preview", icon: MonitorSmartphone },
  { to: "/owner/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/owner/settings", label: "Settings", icon: Settings },
];
