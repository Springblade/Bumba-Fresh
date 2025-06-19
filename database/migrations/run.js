const knex = require('knex');
require('dotenv').config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

async function runMigrations() {
  try {
    // Create meals table
    await db.schema.createTable('meals', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.text('image_url').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.string('prep_time').notNullable();
      table.string('calories').notNullable();
      table.specificType('tags', 'text[]').notNullable();
      table.specificType('categories', 'text[]').notNullable();
      table.string('overlay_badge');
      table.boolean('is_new').defaultTo(false);
      table.timestamps(true, true);
    });

    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
