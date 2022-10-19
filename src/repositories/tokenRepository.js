import { connection } from '../db/connection.js';

async function queryGetSessionByToken(token) {
  return connection.query(`SELECT *  FROM sessions WHERE token = $1;`, [token]);
}

async function queryGetUserById(id) {
  return connection.query(`SELECT * FROM users WHERE id = $1;`, [id]);
}

const tokenRepository = {
  queryGetSessionByToken,
  queryGetUserById,
};

export default tokenRepository;
