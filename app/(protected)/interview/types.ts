import { difficultyOptions, roleOptions, yoeOptions } from "./constants";

export type Role = (typeof roleOptions)[number];
export type Yoe = (typeof yoeOptions)[number];
export type Difficulty = (typeof difficultyOptions)[number]["label"];
export type FormField = "resume" | "role" | "yoe" | "difficulty";
export type FormErrors = Partial<Record<FormField, string>>;
