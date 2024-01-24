"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { signIn } from "@/api/auth";
import { redirect, useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const signInResult = await signIn(data.studentId, data.password);
    setIsLoading(false);

    if (signInResult?.error) {
      toast({
        title: "Invalid student ID or password.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sign in successful.",
        description: "You can start using the portal.",
        variant: "default",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="studentId">
              Student ID
            </Label>
            <Input
              id="studentId"
              placeholder="Student ID"
              type="text"
              autoComplete="studentId"
              inputMode="numeric"
              pattern="^[0-9]*$"
              disabled={isLoading}
              {...register("studentId")}
            />
            {errors?.studentId && (
              <p className="px-1 text-xs text-red-600">
                {errors.studentId.message}
              </p>
            )}
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
