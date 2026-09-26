export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDemoMode: !process.env.DATABASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  openRouterKey: process.env.OPENROUTER_API_KEY,
  
  requireDb: () => {
    if (!process.env.DATABASE_URL) {
      throw new Error("CRITICAL: DATABASE_URL is missing in production environment");
    }
    return process.env.DATABASE_URL;
  }
};
