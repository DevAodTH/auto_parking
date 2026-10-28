"use client";

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
  SidebarProvider,
  SidebarFooter,
} from "@/components/tailgrids/core/sidebar";
import {
  Layers2,
  Fire,
  RefreshCircle1Clockwise,
  BarChartSquare,
  PieChart1,
  ChevronBothDirection,
  Page,
  MusicList2,
  User2,
} from "@tailgrids/icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tailgrids/core/dropdown";

import { useState } from "react";
import * as React from "react";
import { cn } from "@/utils/cn";
import Link from "next/link";

import user from "@/db/user.json";
import { usePathname } from "next/navigation";

export default function SidebarVariantsPreview({
  children,
}: {
  children: React.ReactNode;
}) {
  const [variant] = useState<"sidebar" | "floating" | "inset">("sidebar");

  const [open, setOpen] = React.useState<boolean>(true);
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-dvh w-full">
      <div className="flex flex-1 w-full border-b border-base-200 overflow-hidden bg-background-200">
        <SidebarProvider open={open} onOpenChange={setOpen} className="h-full">
          <Sidebar
            variant={variant}
            className="h-full text-white p-2 bg-slate-900 select-none"
          >
            <SidebarHeader className="flex flex-row items-center gap-3 p-4 w-full">
                <div className="flex h-12 w-12 items-center justify-center">
                  <MusicList2 className="h-8 w-8"/>
                </div>
                
              <div className="flex flex-col text-left">
                <span className="text-base font-bold text-slate-500 leading-tight">
                  ParkPlan
                </span>
                <span className="text-sm text-slate-500">สาขาสยาม</span>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
              <SidebarGroup>
                <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link
                        href="/dashboard"
                        className={
                          pathname === "/dashboard"
                            ? "pointer-events-none flex items-center justify-between gap-3"
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/dashboard" ? "bg-teal-500" : ""
                          }
                        >
                          <PieChart1 /> <span>Dashboard</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link
                        href="/parking-layout"
                        className={
                          pathname === "/parking-layout"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/parking-layout" ? "bg-teal-500" : ""
                          }
                        >
                          <Layers2 /> <span>Parking Layouts</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link
                        href="/financial-overview"
                        className={
                          pathname === "/financial-overview"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/financial-overview"
                              ? "bg-teal-500"
                              : ""
                          }
                        >
                          <BarChartSquare /> <span>Financial Overview</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link
                        href="/activity-log"
                        className={
                          pathname === "/activity-log"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/activity-log" ? "bg-teal-500" : ""
                          }
                        >
                          <RefreshCircle1Clockwise /> <span>Activity Log</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link
                        href="/heat-map"
                        className={
                          pathname === "/heat-map"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/heat-map" ? "bg-teal-500" : ""
                          }
                        >
                          <Fire /> <span>Parking Heat Map</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>จัดการระบบ</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link
                        href="/users"
                        className={
                          pathname === "/users"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={pathname === "/users" ? "bg-teal-500" : ""}
                        >
                          <User2 /> <span>User & Permissions</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link
                        href="/settings"
                        className={
                          pathname === "/settings"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/settings" ? "bg-teal-500" : ""
                          }
                        >
                          <User2 /> <span>System Setting</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link
                        href="/audit-logs"
                        className={
                          pathname === "/audit-logs"
                            ? "pointer-events-none flex items-center justify-between gap-3 "
                            : "flex items-center justify-between gap-3 "
                        }
                      >
                        <SidebarMenuButton
                          className={
                            pathname === "/audit-logs" ? "bg-teal-500" : ""
                          }
                        >
                          <Page /> <span>Audit Logs</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooterSection open={open} />
          </Sidebar>

          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto p-4 md:p-6 bg-background-50">
              <div className="h-full w-full">{children}</div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

function SidebarFooterSection({ open }: { open: boolean }) {
  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "w-full flex items-center rounded-md duration-200 bg-background-soft-50 focus-visible:bg-background-soft-50 aria-expanded:bg-background-soft-100",
            open ? "p-2 justify-between" : "size-8 p-0 justify-center",
          )}
        >
          <div className={cn("flex items-center", open && "gap-2")}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <User2 className="size-4" />
            </div>

            {open && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-text-100">
                  {user[0].name}
                </span>
                <span className="truncate text-xs text-text-100/70">
                  {user[0].email}
                </span>
              </div>
            )}
          </div>

          {open && (
            <ChevronBothDirection className="ml-auto size-4 text-text-100/50" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--sidebar-width) min-w-56 p-1.5 border"
          placement="top"
          offset={6}
        >
          <DropdownMenuHeader className="flex items-center gap-2 p-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <User2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user[0].name}</span>
              <span className="truncate text-xs text-text-100/70">
                {user[0].email}
              </span>
            </div>
          </DropdownMenuHeader>

          <DropdownMenuSeparator className="my-0.5" />
          <DropdownMenuItem
            href="/account"
            className="data-[hovered]:bg-gray-700 data-[hovered]:text-white"
          >
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            href="/login"
            className="data-[hovered]:bg-gray-700 data-[hovered]:text-white"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
