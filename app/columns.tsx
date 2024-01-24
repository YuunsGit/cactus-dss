"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import * as React from "react";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Payment = {
  code: string;
  title: string;
  compulsory: boolean;
  credit: number;
  ects: number;
  semester: number;
  capacity: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mx-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-4"
      />
    ),
  },
  {
    accessorKey: "code",
    header: "Course Code",
  },
  {
    accessorKey: "title",
    header: "Course Title",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="w-56 truncate text-left">
              {row.getValue("title")}
            </div>
          </TooltipTrigger>
          <TooltipContent>{row.getValue("title")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "compulsory",
    header: "Compulsory",
    cell: ({ row }) => (
      <span>
        {row.getValue("compulsory") ? (
          <Icons.check className="mx-auto h-4 w-4" />
        ) : (
          <Icons.close className="mx-auto h-4 w-4" />
        )}
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "credit",
    header: "Credit",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("credit")}</div>
    ),
  },
  {
    accessorKey: "ects",
    header: "ECTS",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("ects")}</div>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("semester")}</div>
    ),
  },
];
