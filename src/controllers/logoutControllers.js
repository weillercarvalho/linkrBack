import { connection } from "../database/db.js";
async function deleteSession(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token === undefined) {
    return res.sendStatus(401);
  }

  await connection.query(
    `UPDATE sessions SET "isValid" = false WHERE token = $1;`,
    [token]
  );

  res.status(200).send("logged out user");
}

export { deleteSession };
