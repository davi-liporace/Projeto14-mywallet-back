import { lancamentos, sessoes, usuarios } from "../index.js";
import dayjs from "dayjs";

export async function postSaidas(req, res) {
  const { authorization } = req.headers;
  const { valor, descricao } = req.body;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const session = await sessoes.findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  const user = await usuarios.findOne({
    _id: session.userId,
  });

  if (user) {
    lancamentos.insertOne({
      valor,
      descricao,
      tipo: "saida",
      data: dayjs(Date.now()).format("DD/MM"),
      tokensessao: token,
    });
    res.send("ok");
  } else {
    res.sendStatus(401);
  }
}
