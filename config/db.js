import pkg from 'pg';
const {Pool} = pkg 
process.loadEnvFile();
 
const {DB_HOST, DB_PASS, DB_DATABASE, DB_USER, DB_PORT} = process.env;


const config = {
user: DB_USER,
password: DB_PASS,
host: DB_HOST,
database:DB_DATABASE,
port: DB_PORT,
allowExitOnIdle: true,
}

const pool = new Pool(config);

/* const getDate = async () =>{
const response = await pool.query('select now()');
console.log(response.rows)}

getDate();
 */
export default pool