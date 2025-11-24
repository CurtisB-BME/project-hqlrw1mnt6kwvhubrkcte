import { createSuperdevClient } from "@superdevhq/client";

export const superdevClient = createSuperdevClient({
  appId: import.meta.env.VITE_APP_ID,
  requiresAuth: false,
  baseUrl: 'https://www.buildy.ai',
  loginUrl: `https://www.buildy.ai/auth/app-login?app_id=${
    import.meta.env.VITE_APP_ID
  }`,
});
