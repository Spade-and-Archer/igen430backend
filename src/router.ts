import { Router } from "express";


export const apiRouter = Router();
apiRouter.get("/hello", async (req, res)=>{
    res.send("hello");
})