import { v4 as uuidv4 } from "uuid";
import { connection } from "../database/db.js";
import * as signRepositories from "../repositories/signRepositories.js";

async function postSignin(req, res) {
  const { email, password } = req.body;

  try {
    const findUser = (
      await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])
    ).rows;

    if (findUser.length === 0) {
      return res.status(401).send({ error: "User not found" });
    }
    const isValid = bcrypt.compareSync(password, findUser[0].password);
    if (!isValid) {
      return res.status(401).send({ error: "Invalid email or password" });
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

export { postSignin };
