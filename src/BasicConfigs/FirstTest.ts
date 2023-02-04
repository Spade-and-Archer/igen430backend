import {PuzzleImplementationModel, PuzzleTemplateModel, TagModel} from "../Models";
import {stateMap} from "../stateManager";

export default async function firstTest(){
    let tags = ["redTag", "blueTag",  "greenTag", "purpleTag"].map((node)=>{
        return new TagModel({
            node_id: node,
            name: node,
            tagGroups: [],
            color: "red",
        })
    })
    let tagSavePromises = tags.map((tag)=>{
        return tag.save();
    })
    while(tagSavePromises.length > 0){
        await tagSavePromises.pop();
    }

    let puzzleTemplate = new PuzzleTemplateModel({
        solutions: [
            {
                solutionName: "basic",
                perReaderRequirements: {
                    "blueReader" : { oneOf: ["blueTag"]},
                    "redReader" : { oneOf: ["redTag"]},
                    "greenReader" : { oneOf: ["greenTag"]},
                }
            }
        ],
        name: "firstPuzzle",
        description: "first puzzle ever",
        readerNamesBySlotID: {
            "blueReader" : "blueReader",
            "redReader": "redReader",
            "greenReader":  "greenReader",
        }
    });
    await puzzleTemplate.save();

    let implementation = new PuzzleImplementationModel({
        puzzleTemplate : puzzleTemplate._id,
        assignedReaders: {
            "blueReader" : "actualBlueReader",
            "redReader": "actualRedReader",
            "greenReader":  "actualGreenReader",
        }
    });

    await implementation.save();

    stateMap["actualBlueReader"] = "blueTag";
    stateMap["actualGreenReader"] = "redTag";
    stateMap["actualRedReader"] = "greenTag";

    let isSolved = await implementation.checkImplementation();
    if(isSolved){
        throw new Error("puzzle should be failed, but was solved");
    }
    console.log("first test passed");
    stateMap["actualBlueReader"] = "blueTag";
    stateMap["actualGreenReader"] = "greenTag";
    stateMap["actualRedReader"] = "redTag";

    isSolved = await implementation.checkImplementation();
    if(!isSolved){
        throw new Error("puzzle should be solved but wasn't");
    }
    console.log("second test passed");
}