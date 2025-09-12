// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'personal-blog',
    user: 'postgres',
    password: '0864072737',
    ssl: false, // เพิ่มบรรทัดนี้
});

export default connectionPool;
