import * as React from "react";

import { FlightConfigSwitcher } from "@/components/config-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"], //TODO Load config profile here
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Flight Status",
          url: "#",
          isActive: true,
        },
        {
          title: "Flight Graphs",
          url: "#",
        },
        {
          title: "Flight Telemetry",
          url: "#",
        },
        {
          title: "Flight Logs",
          url: "#",
        },
        {
          title: "Flight Replay",
          url: "#",
        },
        {
          title: "Streaming Mode",
          url: "#",
        },
      ],
    },
    {
      title: "Configuration",
      url: "#",
      items: [
        {
          title: "Radio Frequency",
          url: "#",
        },
        {
          title: "Flight Configuration",
          url: "#",
        },
      ],
    },
    {
      title: "Ground station",
      url: "#",
      items: [
        {
          title: "Devices List",
          url: "#",
        },
        {
          title: "Device Status",
          url: "#",
        },
        {
          title: "Device Configuration",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <FlightConfigSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
