import { connection } from "../database/db.js";

async function insertUser({ name, email, picture, passwordEncrypted }) {
  await connection.query(
    `INSERT INTO users (name, email, picture, password) VALUES ($1, $2, $3, $4);`,
    [name, email, picture, passwordEncrypted]
  );
}

async function createdSession({ findUser, token }) {
  const result = await connection.query(
    `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
    [findUser[0].id, token]
  );
  return result;
}
export { createdSession, insertUser };
