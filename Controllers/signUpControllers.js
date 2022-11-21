import { signUpSchema } from "../Schemas/signUpSchema.js";
import bcrypt from "bcrypt"
import { usuarios } from "../index.js";

export async function postSignUp(req,res){
const user = req.body;



    

const passwordHash = bcrypt.hashSync(user.senha, 10);

await usuarios.insertOne({ ...user, senha: passwordHash }) 

res.sendStatus(201);
}

export async function getSignUp(req,res){
    try {
        const usuariosEncontrados = await usuarios
          .find()
          .toArray();
    
        res.send(usuariosEncontrados);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    }
