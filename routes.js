import express from "express"
import { postEntradas } from "./Controllers/entradasControllers.js"
import { getHome } from "./Controllers/HomeControllers.js"
import { postSaidas } from "./Controllers/SaidasControllers.js"
import { postSignIn } from "./Controllers/signInControllers.js"
import { getSignUp, postSignUp } from "./Controllers/signUpControllers.js"
import lancamentosMiddleware from "./Middlewares/lancamentosMiddleware.js"
import { signUpMiddleware } from "./Middlewares/signUpMiddleware.js"

const router = express.Router()


router.post("/sign-up",signUpMiddleware,postSignUp)
router.get("/sign-up",getSignUp)
router.post("/", postSignIn)
router.post("/saidas",lancamentosMiddleware,postSaidas)
router.post("/entradas", lancamentosMiddleware,postEntradas)
router.get("/lancamentos",getHome)

export default router