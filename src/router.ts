import { Router } from "express";
import {stateMap} from "./stateManager";
import {PuzzleImplementationModel, PuzzleTemplateModel} from "./Models";


export const apiRouter = Router();
apiRouter.get("/hello", async (req, res)=>{
    res.send("hello");
})
apiRouter.get("/puzzles", async (req, res)=>{
    let allPuzzles = await PuzzleTemplateModel.find({});
    res.send(allPuzzles);
})
apiRouter.post("/solution", async (req, res)=>{
    res.send("hello");
})

apiRouter.post("/updateReader", async (req, res)=>{
    let readerID = req.body.readerID;
    let tagID = req.body.tagID;
    stateMap[readerID] = tagID;
    let allImplementations = await PuzzleImplementationModel.find({});
    let promises = [];
    let impStates = {};
    allImplementations.forEach((imp)=>{
        promises.push(imp.checkImplementation().then((isSolved)=>{
            impStates[imp._id.toString()] = {
                name: imp.name,
                solved: isSolved,
            }
            if(isSolved){
                console.log(`solved ${imp.name}`)
            }
            else {
                console.log(`${imp.name} not solved`)
            }
        }));
    })
    while(promises.length > 0){
        await promises.pop();
    }
    console.log("------------");
    res.send({
        impStates: impStates,
        readerStates: stateMap

    });
})
apiRouter.post("/echo", async (req, res)=>{
    console.log("got echo")
    console.log("Body:")
    console.log(JSON.stringify(req.body));
    console.log("Header:")
    console.log(JSON.stringify(req.header));
    res.send(req.body);
})