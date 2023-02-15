import {PuzzleImplementationModel, PuzzleTemplateModel, TagGroupModel, TagModel} from "../Models";
import {stateMap} from "../stateManager";

export default async function firstTest(){
    let colorsPerTag = {
        "blueTag" : "#1E88E5", "redTag" : "#F44336", "greenTag" : "#4CAF50", "purpleTag": "#9C27B0",
    }
    let IDsPerTag= {
        "blueTag" : "53 E3 4D 1F", "redTag" : "F3 B7 3B 1F", "greenTag" : "B3 6D AF 03", "purpleTag": "#9C27B0",
    }
    let tags = ["blueTag", "redTag",   "greenTag", "purpleTag"].map((node)=>{
        return new TagGroupModel({
            color: colorsPerTag[node],
            icon: "mdiCircleMedium",
            tags : [node , IDsPerTag[node]],
            name: node,
        })
    })
    // tags.push(...(["diamond1", "diamond2", "diamond3"].map((node)=>{
    //     return new TagModel({
    //         node_id: node,
    //         name: node,
    //         color: "red",
    //     })
    // })))
    let diamondGroup = new TagGroupModel({
        name: "diamond",
        color: "#42A5F5",
        icon: "mdiDiamond",
        tags : ["diamond1", "diamond2", "diamond3"]
    })


    let tagSavePromises : Promise<any>[] = tags.map((tag)=>{
        return tag.save();
    })
    tagSavePromises.push(diamondGroup.save());
    while(tagSavePromises.length > 0){
        await tagSavePromises.pop();
    }


    let puzzleTemplate = new PuzzleTemplateModel({
        solutions: [
            {
                solutionName: "basic",
                perReaderRequirements: {
                    "blueReader" : { oneOf: [tags[0]._id.toString()]},
                    "redReader" : { oneOf:  [tags[1]._id.toString()]},
                    "greenReader" : { oneOf: [tags[2]._id.toString()]},
                }
            },
            {
                solutionName: "alternate",
                perReaderRequirements: {
                    "blueReader" : { oneOf: [ diamondGroup._id.toString()]},
                    "redReader" : { oneOf: [ diamondGroup._id.toString()]},
                    "greenReader" : { oneOf: [ diamondGroup._id.toString()]},
                }
            },
        ],
        name: "Basic Puzzle",
        description: "first puzzle ever",
        readerNamesBySlotID: {
            "blueReader" : "blueReader",
            "redReader": "redReader",
            "greenReader":  "greenReader",
        }
    });
    await puzzleTemplate.save();

    let implementation = new PuzzleImplementationModel({
        name: "simpleImplementation",
        puzzleTemplate : puzzleTemplate._id,
        assignedReaders: {
            "blueReader" : "actualBlueReader",
            "redReader": "actualRedReader",
            "greenReader":  "actualGreenReader",
        }
    });

    await implementation.save();

    let implementation2 = new PuzzleImplementationModel({
        name: "simpleImplementation",
        puzzleTemplate : puzzleTemplate._id,
        assignedReaders: {
            "blueReader" : "B4:70:9C:25:BF:58",
            "redReader": "B4:70:9C:25:BF:58",
            "greenReader":  "B4:70:9C:25:BF:58",
        }
    });

    await implementation2.save();

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


    stateMap["actualBlueReader"] = "diamond1";
    stateMap["actualGreenReader"] = "diamond2";
    stateMap["actualRedReader"] = "diamond3";

    isSolved = await implementation.checkImplementation();
    if(!isSolved){
        throw new Error("puzzle should be solved but wasn't");
    }



    stateMap["actualBlueReader"] = "diamond1";
    stateMap["actualGreenReader"] = "diamond1";
    stateMap["actualRedReader"] = "diamond1";

    isSolved = await implementation.checkImplementation();
    if(!isSolved){
        throw new Error("puzzle should be solved but wasn't");
    }
    console.log("second test passed");
}