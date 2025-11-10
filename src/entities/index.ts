import { superdevClient } from "@/lib/superdev/client";

export const Issue = superdevClient.entity("Issue");
export const User = superdevClient.auth;
