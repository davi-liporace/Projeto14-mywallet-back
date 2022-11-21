 import joi from "joi";
 export const signUpSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().required(),
    senha: joi.string().required(),

  });
