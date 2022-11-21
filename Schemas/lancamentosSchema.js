import joi from "joi"

export const lancamentosSchema = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
});