import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snak', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable()
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.boolean('diet_notdiet').notNullable()
  })

  await knex.schema.alterTable('snak', (table) => {
    table.foreign('user_id').references('id').inTable('user')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snak')
}

