import { lancamentos, sessoes, usuarios } from "../index.js";



export async function getHome(req,res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);
  
    const session = await sessoes.findOne({ token });
              
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
  }