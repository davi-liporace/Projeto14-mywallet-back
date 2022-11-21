import { lancamentosSchema } from "../Schemas/lancamentosSchema.js"

export default function lancamentosMiddleware(req,res,next){
const {error} = lancamentosSchema.validate(req.body, {abortEarly:false})
  if(error){
    const errors = error.details.map((detail) => detail.message)
    res.send(errors)
    return
  }
next()}