import { signUpSchema } from "../Schemas/signUpSchema.js";

export async function signUpMiddleware(req,res,next){
    const user = req.body
const { error } = signUpSchema.validate(user, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.send(errors);
      return;
    }
next()
}