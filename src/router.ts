import { Router } from "express";


export const apiRouter = Router();
apiRouter.get("/hello", async (req, res)=>{
    res.send("hello");
})

apiRouter.post("/solution", async (req, res)=>{
    res.send("hello");
})
apiRouter.post("/echo", async (req, res)=>{
    console.log("got echo")
    console.log("Body:")
    console.log(JSON.stringify(req.body));
    console.log("Header:")
    console.log(JSON.stringify(req.header));
    res.send(req.body);
})