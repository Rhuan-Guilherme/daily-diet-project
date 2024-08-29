import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function userRoute(app: FastifyInstance) {
  // Cria um novo usuário
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

  // Lista todos os usuários 
  app.get('/', async () => {
    const data = await knex('user').select('*')

    return data
  })

  // Lista as refeições de um usuário baseado no user_id
  app.get('/snakUser/:id', async (request, reply) => {
    const body = request.params

    const schemaBody = z.object({
      id: z.string().uuid()
    })

    const {id} = schemaBody.parse(body)

    if(id){
      const data = await knex('snak').where('user_id', id)
      const allSnaks = await knex('snak').where('user_id', id).count('* as allSnaks')
      const allSnaksDiet = await knex('snak').where('user_id', id).where('diet_notdiet', true).count('* as allSnaks')
      const allSnaksNotDiet = await knex('snak').where('user_id', id).where('diet_notdiet', false).count('* as allSnaks')
      const info = {allSnaks, allSnaksDiet, allSnaksNotDiet}
      return reply.status(200).send({data, info })
    }
  })


}