import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    TOKEN: z.string(),
    GOOGLE_API: z.string(),
    OWM_API: z.string(),
    GITHUB_USER: z.string(),
    GITHUB_KEY: z.string(),
    MONGOURI: z.string(),
    DEVSERVERID: z.string(),
    OWNERID: z.string(),
    GIPHYAPI: z.string(),
    MCHOST: z.string(),
    AS_APIKEY: z.string(),
    GENIUSAPI: z.string(),
    MARVELPUBLICKEY: z.string(),
    MARVELPRIVATEKEY: z.string(),
    EXPRESS_PORT: z.number(),
    OPENAI_KEY: z.string(),
    DHL_API_KEY: z.string(),
    DHL_SECRET: z.string()
  });

envSchema.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }
}