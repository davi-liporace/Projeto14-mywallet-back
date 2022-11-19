import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const signUpSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().required(),
    senha: joi.string().required(),

  });

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => console.log("conectado"));
mongoClient.connect().catch((err) => console.log(err));

let db = mongoClient.db("MyWallet");
let entradas = db.collection("Entradas");
let saidas = db.collection("Saidas");
let usuarios = db.collection("Usuarios")


//Sign-Up

app.post("/sign-up", async (req, res) => {
    // nome, email, senha
const user = req.body;

const { error } = signUpSchema.validate(user, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.send(errors);
      return;
    }

    

const passwordHash = bcrypt.hashSync(user.senha, 10);

await usuarios.insertOne({ ...user, senha: passwordHash }) 

res.sendStatus(201);
});


app.get("/sign-up", async (req, res) => {
    try {
      const usuariosEncontrados = await usuarios
        .find()
        .toArray();
  
      res.send(usuariosEncontrados);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });


//Sign-In

app.post("/sign-in", async (req, res) => {
    const { email, senha } = req.body;
    
    const user = await usuarios.findOne({ email });

    if(user && bcrypt.compareSync(senha, user.senha)) {
        res.send("Login realizado")
    } else {
        res.send("erro")
        // usuário não encontrado (email ou senha incorretos)
    }
});





app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
