import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function addHours(date: Date, hours: number) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
}

export function getSuggestion(code: string) {
  return (
    {
      CMM192:
        "Explores psychology through film. Recommended if interested in the psychology-cinema intersection.",
      CMM193:
        "Focuses on international relations and global politics. Recommended for a broader perspective on world events.",
      CMM191:
        "Explores art entrepreneurship, blending creativity with business. Recommended for those interested in merging art and business opportunities.",
      CMM194:
        "Covers basic concepts of web series production. Ideal for those into digital media and considering creating their own web series.",
      CENG102:
        "Essential for advanced Java programming and deepening algorithmic understanding.",
      CMM190:
        "If not keen on business model design, prioritize the mandatory CENG102 course for programming and algorithms.",
      IE112:
        "Covers computer-aided technical drawing, crucial for enhancing fundamental skills in technical drawing.",
      MM185:
        "If you want to deepen your interest in technical drawings and strengthen skills in this area, prioritize the mandatory IE112 course. In this case, consider dropping MM185.",
    }[code] || ""
  );
}
