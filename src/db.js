import pkg from 'pg'; // Import `pg` as a default package
const { Pool } = pkg; // Extract `Pool` from the default import

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'shopaholic'
});

export default pool;
