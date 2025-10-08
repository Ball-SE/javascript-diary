// Create PostgreSQL Connection Pool here !
// import * as pg from "pg";
// const { Pool } = pg.default;

// const connectionPool = new Pool({
//     host: 'localhost',
//     port: 5432,
//     database: 'personal-blog',
//     user: 'postgres',
//     password: '0864072737',
//     ssl: false, // เพิ่มบรรทัดนี้
// });

// export default connectionPool;


// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;
import dotenv from "dotenv";

dotenv.config();

const connectionPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default connectionPool;