"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/providers/auth-provider";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/api/auth";
import { Icons } from "@/components/icons";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getCourses } from "@/api/course";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import * as React from "react";
import { cn, getSuggestion } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const student = useContext(AuthContext);
  if (!student) redirect("/login");

  const [data, setData] = useState<{ courses: any[]; schedules: any[] }>({
    courses: [],
    schedules: [],
  });
  const [selected, setSelected] = useState({});
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const { setTheme } = useTheme();

  useEffect(() => {
    getCourses(student).then((courses) => {
      const courseInfo = courses.map((c) => ({
        code: c.course.code,
        title: c.course.title,
        credit: c.course.credit,
        ects: c.course.ects,
        capacity: c.course.capacity,
        compulsory: !c.isElective,
        semester: c.semester,
      }));
      const scheduleInfo = courses.reduce(
        (acc: any[], c) => [
          ...acc,
          ...c.course.courseSchedules.map((s) => ({
            ...s,
            code: c.course.code,
            title: c.course.title,
            compulsory: !c.isElective,
          })),
        ],
        [],
      );
      setData({ schedules: scheduleInfo, courses: courseInfo });
    });
  }, []);

  useEffect(() => {
    setSelectedCourses(
      data.courses.filter((c, index) =>
        Object.keys(selected).includes(index.toString()),
      ),
    );
  }, [data.courses, selected]);

  useEffect(() => {
    const schdls = data.schedules.filter((s, index) =>
      selectedCourses.map((c) => c.code).some((code) => code === s.code),
    );
    setSelectedSchedules(schdls);
    const cnflts: React.SetStateAction<any[]> = [];
    for (const s in schdls) {
      for (const s2 in schdls) {
        if (
          s !== s2 &&
          !cnflts.some(
            (c) =>
              c.key ===
              `${schdls[s].courseScheduleId}-${schdls[s2].courseScheduleId}`,
          ) &&
          !cnflts.some(
            (c) =>
              c.key ===
              `${schdls[s2].courseScheduleId}-${schdls[s].courseScheduleId}`,
          )
        ) {
          if (
            schdls[s].dayOfWeek === schdls[s2].dayOfWeek &&
            schdls[s].startTime < schdls[s2].endTime &&
            schdls[s].endTime > schdls[s2].startTime
          ) {
            cnflts.push({
              s1: schdls[s],
              s2: schdls[s2],
              startTime: Math.max(schdls[s].startTime, schdls[s2].startTime),
              endTime: Math.min(schdls[s].endTime, schdls[s2].endTime),
              key: `${schdls[s].courseScheduleId}-${schdls[s2].courseScheduleId}`,
              dayOfWeek: schdls[s].dayOfWeek,
            });
          }
        }
      }
    }
    setConflicts(cnflts);
  }, [data.schedules, selectedCourses]);

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={20}>
        <div className="flex h-full w-full flex-col items-center justify-between border-r p-4">
          <div className="flex h-full w-full flex-col items-center space-y-6">
            <Avatar className="mt-4 h-36 w-36">
              <AvatarImage
                src={`/avatars/students/${student.gender.toLowerCase()}/${(student.studentId % 24) + 1}.jpg`}
              />
            </Avatar>
            <h2 className="text-2xl font-bold">{`${student.firstName} ${student.lastName}`}</h2>
            <Table className="mt-4 w-full">
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">Student ID</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Department</TableCell>
                  <TableCell>{student.department}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Email</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Gender</TableCell>
                  <TableCell>{student.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Advisor</TableCell>
                  <TableCell>
                    <Avatar className="mr-2 inline-block h-6 w-6 align-middle">
                      <AvatarImage
                        src={`/avatars/lecturers/${student.advisorGender.toLowerCase()}/${(student.advisorId % 24) + 1}.jpg`}
                      />
                    </Avatar>
                    {student.advisor}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-12 space-x-4 self-start">
            <Button
              onClick={() => {
                signOut();
                redirect("/login");
              }}
              variant="outline"
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Sign out
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="aspect-square translate-y-0.5"
                >
                  <Icons.sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Icons.moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <div className="h-full w-full">
          <h1 className="w-full border-b px-8 py-6 text-3xl font-bold">
            Course Selection
          </h1>
          <div className="mr-auto w-fit space-y-4 px-8 py-6">
            <h2 className="text-xl">Curriculum courses</h2>
            <DataTable
              columns={columns}
              data={data.courses}
              rowSelection={selected}
              setRowSelection={setSelected}
            />
          </div>
          <div className="w-full space-y-4 px-8 py-6">
            <h2 className="text-xl">Schedule</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="w-40 py-4 text-center font-bold">
                    Monday
                  </TableHead>
                  <TableHead className="w-40 py-4 text-center font-bold">
                    Tuesday
                  </TableHead>
                  <TableHead className="w-40 py-4 text-center font-bold">
                    Wednesday
                  </TableHead>
                  <TableHead className="w-40 py-4 text-center font-bold">
                    Thursday
                  </TableHead>
                  <TableHead className="w-40 py-4 text-center font-bold">
                    Friday
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((time) => (
                  <TableRow key={time}>
                    <TableCell className="h-12 -translate-y-1/2 ">
                      {`${time}:00`}
                    </TableCell>
                    {[1, 2, 3, 4, 5].map((day) => (
                      <TableCell key={day} className="relative">
                        {selectedSchedules
                          .filter(
                            (sch) =>
                              sch.dayOfWeek === day && sch.startTime === time,
                          )
                          .map((sch) => (
                            <div
                              key={sch.courseScheduleId}
                              className={cn(
                                "absolute flex h-12 w-10/12 -translate-y-6 items-center justify-center rounded-lg border border-[#22c55e] bg-[#22c55e] bg-opacity-10 text-center font-bold text-[#22c55e] opacity-70",
                                sch.endTime - sch.startTime === 2 && "h-24",
                                sch.endTime - sch.startTime === 3 && "h-36",
                              )}
                            >
                              {sch.code}
                            </div>
                          ))}
                        {conflicts
                          .filter(
                            (sch) =>
                              sch.dayOfWeek === day && sch.startTime === time,
                          )
                          .map((sch) => (
                            <Dialog key={sch.key}>
                              <DialogTrigger
                                className={cn(
                                  "z-2 absolute flex h-12 w-10/12 -translate-y-6 items-center justify-center rounded-lg border border-red-700 bg-red-700 bg-opacity-20 text-center font-bold text-red-700 opacity-70",
                                  sch.endTime - sch.startTime === 2 && "h-24",
                                  sch.endTime - sch.startTime === 3 && "h-36",
                                )}
                              >
                                <div>Conflict</div>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {`There is a conflict between ${sch.s1.code} and ${sch.s2.code}`}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {getSuggestion(sch.s1.code) && (
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                          <AccordionTrigger>
                                            {`${sch.s1.code} - ${sch.s1.title}`}
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            {getSuggestion(sch.s1.code)}
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    )}
                                    {getSuggestion(sch.s2.code) && (
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                          <AccordionTrigger>
                                            {`${sch.s2.code} - ${sch.s2.title}`}
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            {getSuggestion(sch.s2.code)}
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    )}
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                  {!sch.s2.compulsory && (
                                    <Button
                                      onClick={() => {
                                        const newSelected = Object.keys(
                                          selected,
                                        )
                                          .filter(
                                            (s) =>
                                              data.courses[parseInt(s)].code !==
                                              sch.s2.code,
                                          )
                                          .reduce((acc, s) => {
                                            // @ts-ignore
                                            acc[s] = true;
                                            return acc;
                                          }, {});
                                        setSelected(newSelected);
                                      }}
                                      type="button"
                                    >
                                      Drop {sch.s2.code}
                                    </Button>
                                  )}
                                  {!sch.s1.compulsory && (
                                    <Button
                                      onClick={() => {
                                        const newSelected = Object.keys(
                                          selected,
                                        )
                                          .filter(
                                            (s) =>
                                              data.courses[parseInt(s)].code !==
                                              sch.s1.code,
                                          )
                                          .reduce((acc, s) => {
                                            // @ts-ignore
                                            acc[s] = true;
                                            return acc;
                                          }, {});
                                        setSelected(newSelected);
                                      }}
                                      type="button"
                                    >
                                      Drop {sch.s1.code}
                                    </Button>
                                  )}
                                  <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                      Close
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
