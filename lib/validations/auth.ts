import * as z from "zod";

export const userAuthSchema = z.object({
  studentId: z.string(),
  password: z.string(),
});
