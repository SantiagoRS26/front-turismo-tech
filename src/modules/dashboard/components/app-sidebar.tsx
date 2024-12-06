"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
  user: {
    name: "Bobby",
    email: "BobbyBot2024@gmail.com",
    avatar: "https://www.pngitem.com/pimgs/m/560-5603874_product-image-logo-avatar-minimalist-flat-line-hd.png",
  },
  navMain: [
    {
      title: "Estadisticas",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "FeedBack",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Configuración",
          url: "#",
        },
      ],
    },
    {
      title: "Modelo",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
	  <Sidebar collapsible="icon" {...props}>
		<SidebarHeader className="">
		  <div className="w-full h-auto flex justify-center items-center">
			<img 
			  src="logo.png" 
			  alt="Logo" 
			  className="w-auto h-auto max-h-28 object-cover"
			/>
		  </div>
		</SidebarHeader>
		<SidebarContent>
		  <NavMain items={data.navMain} />
		</SidebarContent>
		<SidebarFooter>
		  <NavUser user={data.user} />
		</SidebarFooter>
		<SidebarRail />
	  </Sidebar>
	)
  }
  
  
