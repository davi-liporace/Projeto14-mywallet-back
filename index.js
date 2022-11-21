import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { postSignUp } from "./Controllers/signUpControllers.js";
import router from "./routes.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => console.log("conectado"));
mongoClient.connect().catch((err) => console.log(err));

export const db = mongoClient.db("MyWallet");
export const usuarios = db.collection("Usuarios");
export const sessoes = db.collection("sessions");
export const lancamentos = db.collection("lancamentos");

app.use(router);

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
