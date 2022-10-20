import logout from "../repositories/logoutRepositories.js";

async function deleteSession(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token === undefined) {
    return res.sendStatus(401);
  }

  try {
    await logout({ token });
    res.status(200).send("logged out user");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { deleteSession };
