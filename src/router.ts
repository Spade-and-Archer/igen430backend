import { Router } from "express";
import {stateMap} from "./stateManager";
import {PuzzleImplementationModel, PuzzleTemplateModel, TagGroupModel} from "./Models";
import {
    addOrEditPuzzleImplementation,
    addOrEditPuzzleTemplate,
    addOrEditTagGroup,
    deletePuzzleTemplate
} from "./updateModels";
import fetch from "node-fetch";
import * as dgram from "dgram";

async function sleep(delay = 100, fn = undefined, ...args) {
    await timeout(delay);
    if (fn) {
        return fn(...args);
    }
    else {
        return;
    }
}
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let dateOfLastChange = new Date();
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
let cachedImpSolved = {};
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
            if(cachedImpSolved[imp._id.toString()] !== isSolved){
                if(imp.action && actions[imp.action]){
                    actions[imp.action](isSolved);
                }
            }
            cachedImpSolved[imp._id.toString()] = isSolved
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
    res.status(200).send();
    dateOfLastChange = new Date(Date.now());
    // res.send({
    //     impStates: impStates,
    //     readerStates: stateMap
    // });
})
apiRouter.get("/temp", async (req, res)=>{
    actions["open box"](true);
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
    let dateOfRequest = new Date(Date.now());

    while(Math.abs(Date.now() - dateOfLastChange.valueOf()) > 1500 && Math.abs(Date.now() - dateOfRequest.valueOf()) < 5000){
        await sleep(10);
    }
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
let registeredActuators = {}
let actions = {
    "open box" : async (solved)=>{
        try{
            let boxOpeningID = "24:24:AC:84:21:78"
            if(!registeredActuators[boxOpeningID]){
                return;
            }
            let client = dgram.createSocket('udp4');
            client.send((solved ? 180 : 0).toString(), parseInt(registeredActuators[boxOpeningID].port.toString()), registeredActuators[boxOpeningID].ip, (err, bytes)=>{
                client.close();
            });
            // let response = await fetch(`http://${registeredActuators[boxOpeningID].ip}:${registeredActuators[boxOpeningID].port}/`,{
            //     method: "POST",
            //     body: `{message: ${solved ? 20 : 0}}`,
            //     headers: {
            //         'Content-Type': 'application/json'
            //         // 'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     redirect: 'follow', // manual, *follow, error
            //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // }).catch((e)=>{
            //     console.warn(e);
            // })
        }catch(e){

        }
    }
}
apiRouter.post("/registerActuator/", async (req, res)=>{
    let body = req.body;
    let ip =  req.ip.replace("::ffff:", "");
    registeredActuators[body.sensorID] = {
        ip: ip,//body.IPaddress,
        port: body.portNumber,
    };
    res.status(200).send();
})
apiRouter.post("/puzzles/", addOrEditPuzzleTemplate)
apiRouter.post("/puzzles/:id", addOrEditPuzzleTemplate)
apiRouter.delete("/puzzles/:id", deletePuzzleTemplate)
apiRouter.post("/tagGroups/", addOrEditTagGroup)
apiRouter.post("/tagGroups/:id", addOrEditTagGroup)
apiRouter.post("/PuzzleImplementations/:id", addOrEditPuzzleImplementation)
apiRouter.post("/PuzzleImplementations/", addOrEditPuzzleImplementation)