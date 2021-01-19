//connection with MySQL
const mysql = require('mysql2/promise');

//connection parameters
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aassaa903#",
  port: 3306,
  database: "licenta",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//execute any SQL statement/query
async function runSQL(statement) {
  var results = [];
  //const parsed = statement.replace(/(\r\n|\n|\r)/gm, "");
  const parsed = statement.replace(/\s\s+/g, ' ').replace("varchar2","varchar");
  const statemets = parsed.split(';');

  if (statemets.length > 2) {
    for (let i = 0; i < statemets.length - 1; i++) {
      if (statement[i] !== "")
      results.push(await pool.query(statemets[i]));
    }
    return results;
  } else if (statemets.length == 2){
    const result = await pool.query(statemets[0]);
    return result[0];
  }

  //error case, no statement to run
  return null;

}

module.exports = {
  runSQL
}
