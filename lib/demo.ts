// The public preview is the default until the real product is ready to launch.
// Set NEXT_PUBLIC_DEMO_MODE=false to restore the authenticated Supabase flow.
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
