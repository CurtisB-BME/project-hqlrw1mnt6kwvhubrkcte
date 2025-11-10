import { superdevClient } from "@/lib/superdev/client";

export const Issue = superdevClient.entity("Issue");
export const Product = superdevClient.entity("Product");
export const User = superdevClient.auth;
