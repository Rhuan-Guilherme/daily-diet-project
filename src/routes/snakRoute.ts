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


      let session_id;
      const session = await knex('user').select('session_id').where('id', user_id)
      if(session[0].session_id === null){
        await knex('user').update({
          session_id: randomUUID()
        }).where('id', user_id)
      } else {
        session_id = session[0].session_id 
      }
    
      const userId = await knex('user').select('id').where('session_id', session_id)
      console.log(userId[0].id);
      
  
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

  app.put('/:id/:snak', async (request, reply) => {
    const body = request.body
    const params = request.params

    const schemaBody = z.object({
      name: z.string(),
      description: z.string(),
      diet_notdiet: z.boolean()
    })

    const schemaParams = z.object({
      id: z.string().uuid(),
      snak: z.string().uuid()
    })

    const {id, snak} = schemaParams.parse(params)
    const {name, description, diet_notdiet} = schemaBody.parse(body)

    if(id){
      await knex('snak').update({
          name, 
          description, 
          diet_notdiet
      }).where('user_id', id).where('id', snak)

      return reply.status(200).send()
    }
  })
}