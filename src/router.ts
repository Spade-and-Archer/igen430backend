import { Router } from "express";
import {stateMap} from "./stateManager";
import {PuzzleImplementationModel, PuzzleTemplateModel, TagGroupModel} from "./Models";
import {addOrEditPuzzleImplementation, addOrEditPuzzleTemplate, addOrEditTagGroup} from "./updateModels";


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
    console.log("Body:")
    console.log(JSON.stringify(req.body));
    console.log("Header:")
    console.log(JSON.stringify(req.header));
    let readerID = req.body.readerID || req.body.sensorID;
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

    console.log(stateMap);

    console.log("------------");
    // res.send({
    //     impStates: impStates,
    //     readerStates: stateMap
    // });
})
apiRouter.post("/echo", async (req, res)=>{
    console.log("got echo")
    console.log("Body:")
    console.log(JSON.stringify(req.body));
    console.log("Header:")
    console.log(JSON.stringify(req.header));
    res.send(req.body);
})
apiRouter.get("/all/", async (req, res)=>{
    let puzzles = await PuzzleTemplateModel.find({});
    let tagGroups = await TagGroupModel.find({});
    let implementations = await PuzzleImplementationModel.find({});
    res.status(200).send({
        puzzles: puzzles,
        tagGroups: tagGroups,
        puzzleImplementations: implementations,
    })
});
apiRouter.get("/currentReaderStates", async (req, res)=>{
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

    res.status(200).send({
        readerStates: stateMap,
        implementationStates: impStates,
    });
});
apiRouter.post("/puzzles/", addOrEditPuzzleTemplate)
apiRouter.post("/puzzles/:id", addOrEditPuzzleTemplate)
apiRouter.post("/tagGroups/", addOrEditTagGroup)
apiRouter.post("/tagGroups/:id", addOrEditTagGroup)
apiRouter.post("/PuzzleImplementations/:id", addOrEditPuzzleImplementation)
apiRouter.post("/PuzzleImplementations/", addOrEditPuzzleImplementation)