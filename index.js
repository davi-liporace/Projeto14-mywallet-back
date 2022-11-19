import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const signUpSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().required(),
    senha: joi.string().required(),

  });

  const lancamentosSchema = joi.object({
    valor: joi.string().required(),
    descricao: joi.string().required(),
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => console.log("conectado"));
mongoClient.connect().catch((err) => console.log(err));

let db = mongoClient.db("MyWallet");
let entradas = db.collection("Entradas");
let saidas = db.collection("Saidas");
let usuarios = db.collection("Usuarios")
let sessoes = db.collection("sessions")
let lancamentos = db.collection("lancamentos")



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
    const { email, senha} = req.body;
    
    const user = await usuarios.findOne({ email });

    if(user && bcrypt.compareSync(senha, user.senha)) {
        const token = uuid();
        
				await sessoes.insertOne({
					userId: user._id,
					token
				})

        res.send(token);
    } else {
        res.send("erro")
    }
});


// Post saidas

app.post("/saidas", async (req,res) => {
    const { authorization } = req.headers;
    const {valor, descricao} = req.body;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);
  
    const session = await sessoes.findOne({ token });
              
    if (!session) {
        return res.sendStatus(401);
    }
  
      const user = await usuarios.findOne({ 
          _id: session.userId 
      })
  const {error} = lancamentosSchema.validate(req.body, {abortEarly:false})
  if(error){
    const errors = error.details.map((detail) => detail.message)
    res.send(errors)
    return
  }
   if(user) {
      lancamentos.insertOne({valor, descricao, tipo:"saida"}) 
      res.send("ok")

    } else {
      res.sendStatus(401);
    }
  });

// Post entradas 
  app.post("/entradas", async (req,res) => {
    const { authorization } = req.headers;
    const {valor, descricao} = req.body;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);
  
    const session = await sessoes.findOne({ token });
              
    if (!session) {
        return res.sendStatus(401);
    }
  
      const user = await usuarios.findOne({ 
          _id: session.userId 
      })
  const {error} = lancamentosSchema.validate(req.body, {abortEarly:false})
  if(error){
    const errors = error.details.map((detail) => detail.message)
    res.send(errors)
    return
  }
   if(user) {
      lancamentos.insertOne({valor, descricao, tipo:"entrada"}) 
      res.send("ok")

    } else {
      res.sendStatus(401);
    }
  });


  app.get("/lancamentos", async (req,res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);
  
    const session = await db.collection("sessions").findOne({ token });
              
    if (!session) {
        return res.sendStatus(401);
    }
  
      const user = await usuarios.findOne({ 
          _id: session.userId 
      })
  
    if(user) { 
        const lancamentosEncontrados = await lancamentos.find().toArray()
        res.send(lancamentosEncontrados)
    } else {
      res.sendStatus(401);
    }
  });




app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
