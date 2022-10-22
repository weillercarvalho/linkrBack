import { v4 as uuidv4 } from "uuid";
import { connection } from "../database/db.js";
import * as signRepositories from "../repositories/signRepositories.js";
import bcrypt from "bcrypt";

async function postSignup(req, res) {
  const { name, email, password, picture } = req.body;

  try {
    const findEmail = (
      await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])
    ).rows;
    if (findEmail.length > 0) {
      return res.status(409).send({ error: "Email already registered!" });
    }

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    await signRepositories.insertUser({
      name,
      email,
      picture,
      passwordEncrypted,
    });

    res.status(201).send("User registered");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function postSignin(req, res) {
  const { email, password } = req.body;

  try {
    const findUser = (
      await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])
    ).rows;

    if (findUser.length === 0) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const isValid = bcrypt.compareSync(password, findUser[0].password);
    if (!isValid) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const existingSession = await connection.query(
      `SELECT sessions.id 
      FROM users 
      JOIN sessions ON users.id = sessions."userId"  
      WHERE email = $1 
      AND "isValid" = 'true';`,
      [email]
    );
    if (existingSession.rows.length > 0) {
      await connection.query(
        `DELETE FROM sessions WHERE id = $1 AND "isValid" = true;`,
        [existingSession.rows[0].id]
      );
    }

    const token = uuidv4();
    await signRepositories.createdSession({
      findUser,
      token,
    });

    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { postSignin, postSignup };
