import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function userRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const bodyData = request.body

    const data = z.object({
      name: z.string(),
      email: z.string(),
      age: z.number()
    })

    const { name, email, age } = data.parse(bodyData) 

     await knex('user').insert({
      id: randomUUID(),
      name,
      email, 
      age
    })

    return reply.status(201).send('criado com sucesso')
  })

  app.get('/', async () => {
    const data = await knex('user').select('*')

    return data
  })
}