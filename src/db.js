import pkg from 'pg'; // Import `pg` as a default package
const { Pool } = pkg; // Extract `Pool` from the default import

export const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'user123',
  password: 'password123',
  database: 'db123'
});

export default pool;
