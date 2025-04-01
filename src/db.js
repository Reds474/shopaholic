import pkg from 'pg'; // Import `pg` as a default package
const { Pool } = pkg; // Extract `Pool` from the default import

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password123',
  database: 'shopaholic'
});

export default pool;
