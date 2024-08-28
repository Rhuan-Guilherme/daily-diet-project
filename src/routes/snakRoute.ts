import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function snakRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const body = request.body

    const schemaBody = z.object({
      user_id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      diet_notdiet: z.boolean()
    })

    const {user_id, name, description, diet_notdiet} = schemaBody.parse(body)

  
      await knex('snak').insert({
        id: randomUUID(),
        user_id,
        name,
        description,
        created_at: new Date(),
        diet_notdiet
      })
    
      return reply.status(201).send('Criado com sucesso')
  })

  app.get('/', async () => {
    const snaks = await knex('snak').select('*')

    return snaks
  })

  app.get('/:id', async (request) => {
    const params = request.params

    const schemaParams = z.object({
      id: z.string().uuid()
    })

    const {id} = schemaParams.parse(params)

    let snaks;
    if(id){
      snaks = await knex('snak').select('*').where('id', id)
    }

    return snaks
  })

  app.delete('/:id', async (request, reply) => {
    const params = request.params

    const schemaParams = z.object({
      id: z.string().uuid()
    })

    const {id} = schemaParams.parse(params)

    if(id){
      await knex('snak').delete('*').where('id', id)
    }

    return reply.status(200).send('excluido com sucesso')
  })
}