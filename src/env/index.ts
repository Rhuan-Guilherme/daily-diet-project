import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333) ,
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']) ,
  DATABASE_URL: z.string()
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
  console.log('Invalid enviriouments variables ' + _env.error);
  
  throw new Error('Invalid enviriouments variables ' + _env.error)
}

export const env = _env.data