import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useFlightConfig } from "@/context/flight-configs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateRandomUUID } from "@/lib/utils";
import { useState } from "react";


export function FlightConfigSwitcher() {
  const { state: flightConfig, dispatch: flightConfigDispatch } =
    useFlightConfig();

  const [newConfig, setNewConfig] = useState({
    id: generateRandomUUID(),
    name: "",
    description: "",
  });

  const handleCreateNewConfig = () => {
    flightConfigDispatch({
      type: "CREATE_CONFIG",
      payload: newConfig,
    });
  }

  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">
                    {flightConfig.currentConfig?.name}
                  </span>
                  <span className="">
                    {flightConfig.currentConfig?.description}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width]"
              align="start"
            >
              {flightConfig.configs.map((config) => (
                <DropdownMenuItem
                  key={config.id}
                  onSelect={() =>
                    flightConfigDispatch({
                      type: "SET_CURRENT_CONFIG",
                      payload: config,
                    })}
                >
                  {config.name}
                  {config.id === flightConfig.currentConfig?.id && (
                    <Check className="ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
              {flightConfig.configs.length === 0 && (
                <DropdownMenuItem disabled>
                  No configuration found.
                </DropdownMenuItem>
              )}
              <Separator className="my-2" />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  Create New Configuration <Plus className="ml-auto" />
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Configuration</DialogTitle>
          <DialogDescription>
            Create a new configuration profile for your rocket flight.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter configuration name"
              className="col-span-3"
              value={newConfig.name}
              onChange={(event) =>
                setNewConfig({ ...newConfig, name: event.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter configuration description"
              className="col-span-3"
              value={newConfig.description}
              onChange={(event) =>
                setNewConfig({ ...newConfig, description: event.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleCreateNewConfig}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
