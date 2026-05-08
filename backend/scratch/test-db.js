const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    const res = await client.query('SELECT current_database()');
    console.log('Connected to database:', res.rows[0].current_database);
    client.release();
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    process.exit();
  }
}

testConnection();
