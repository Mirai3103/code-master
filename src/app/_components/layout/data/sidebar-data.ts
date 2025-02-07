import {
  TbBarrierBlock as IconBarrierBlock,
  TbBinaryTree as IconBinaryTree,
  TbBrandCSharp as IconBrandCSharp,
  TbBrowserCheck as IconBrowserCheck,
  TbBug as IconBug,
  TbError404 as IconError404,
  TbHelp as IconHelp,
  TbLayoutDashboard as IconLayoutDashboard,
  TbLock as IconLock,
  TbLockAccess as IconLockAccess,
  TbMessages as IconMessages,
  TbNotification as IconNotification,
  TbPackages as IconPackages,
  TbPalette as IconPalette,
  TbServerOff as IconServerOff,
  TbSettings as IconSettings,
  TbTag as IconTag,
  TbTool as IconTool,
  TbUserCog as IconUserCog,
  TbUserOff as IconUserOff,
} from "react-icons/tb";
import {
  LuAudioWaveform as AudioWaveform,
  LuCommand as Command,
  LuGalleryVerticalEnd as GalleryVerticalEnd,
} from "react-icons/lu";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "Chung",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconLayoutDashboard,
        },
        {
          title: "Tags",
          url: "/admin/tags",
          icon: IconTag,
        },
        {
          title: "Ngôn ngữ lập trình",
          url: "/admin/languages",
          icon: IconBrandCSharp,
        },
        {
          title: "Apps",
          url: "/apps",
          icon: IconPackages,
        },
        {
          title: "Chats",
          url: "/chats",
          badge: "3",
          icon: IconMessages,
        },
        {
          title: "Bài toán",
          url: "/admin/problems",
          icon: IconBinaryTree,
        },
      ],
    },
    {
      title: "Hệ thống",
      items: [
        {
          title: "Auth",
          icon: IconLockAccess,
          items: [
            {
              title: "Người dùng",
              url: "/admin/users",
            },
            {
              title: "Vai trò",
              url: "/admin/roles",
            },
          ],
        },
        {
          title: "Errors",
          icon: IconBug,
          items: [
            {
              title: "Unauthorized",
              url: "/401",
              icon: IconLock,
            },
            {
              title: "Forbidden",
              url: "/403",
              icon: IconUserOff,
            },
            {
              title: "Not Found",
              url: "/404",
              icon: IconError404,
            },
            {
              title: "Internal Server Error",
              url: "/500",
              icon: IconServerOff,
            },
            {
              title: "Maintenance Error",
              url: "/503",
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: "Khác",
      items: [
        {
          title: "Cài đặt",
          icon: IconSettings,
          items: [
            {
              title: "Profile",
              url: "/settings",
              icon: IconUserCog,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: IconTool,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: IconPalette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: IconNotification,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: IconHelp,
        },
      ],
    },
  ],
};
