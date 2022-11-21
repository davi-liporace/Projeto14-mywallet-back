import { sessoes, usuarios } from "../index.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';



export async function postSignIn(req,res){
    const { email, senha} = req.body;
    
    const user = await usuarios.findOne({ email });

    if(user && bcrypt.compareSync(senha, user.senha)) {
        const token = uuid();
        
				await sessoes.insertOne({
					userId: user._id,
					token
				})
const respostaFront = {...user, token:token}
        res.send(respostaFront);
    } else {
        res.status(400).status("erro")
    }
}