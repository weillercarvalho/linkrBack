import { connection } from "../database/db.js";

async function createdSession({ findUser, token }) {
  const result = await connection.query(
    `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
    [findUser[0].id, token]
  );
  return result;
}
export { createdSession };
