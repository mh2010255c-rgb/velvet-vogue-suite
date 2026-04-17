import {
  LayoutDashboard,
  Shirt,
  CalendarCheck,
  Users,
  ShoppingBag,
  Calendar,
  Heart,
  Settings,
  UserCircle2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const managementItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Dresses", url: "/dresses", icon: Shirt },
  { title: "Bookings", url: "/bookings", icon: CalendarCheck },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Calendar", url: "/calendar", icon: Calendar },
];

const publicItems = [
  { title: "Catalog", url: "/catalog", icon: ShoppingBag },
  { title: "Wishlist", url: "/wishlist", icon: Heart },
];

const accountItems = [
  { title: "My Profile", url: "/profile", icon: UserCircle2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="pt-4">
        {!collapsed && (
          <div className="px-6 pb-4 mb-2 border-b border-border/30">
            <h1 className="font-display text-xl font-bold text-gradient">
              Dress Boutique
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Manager</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="transition-colors duration-200 hover:bg-primary/10"
                      activeClassName="bg-primary/15 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider">
            Public
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="transition-colors duration-200 hover:bg-primary/10"
                      activeClassName="bg-primary/15 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
