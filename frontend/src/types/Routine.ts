import type { Exercise } from "./Exercise";

export type Routine = {
  id: number;
  name: string;
  description: string | null;
  exercises?: Exercise[];
};