import { connection } from "../database/db.js";

async function logout({ token }) {
  await connection.query(
    `UPDATE sessions SET "isValid" = false WHERE token = $1;`,
    [token]
  );
}
export default logout;
