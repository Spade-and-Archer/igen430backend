import {PuzzleImplementationModel, PuzzleTemplateModel, TagGroupModel, TagModel} from "../Models";
import {stateMap} from "../stateManager";
//"80:F0:3A:25:BF:58"
//"A0:1D:AC:84:21:78"
//"C0:3F:C0:55:B5:94"
//"4C:40:C0:55:B5:94"

export default async function firstTest(){
    let colorsPerTag = {
        "blueTag" : "#1E88E5", "redTag" : "#F44336", "greenTag" : "#4CAF50", "purpleTag": "#9C27B0",
    }
    let IDsPerTag= {
        "blueTag" : "53 E3 4D 1F", "redTag" : "BB D7 A3 7A", "greenTag" : "B3 6D AF 03", "purpleTag": "#9C27B0",
    }
    let tags = ["blueTag", "redTag",   "greenTag", "purpleTag"].map((node)=>{
        return new TagGroupModel({
            color: colorsPerTag[node],
            icon: "mdiCircleMedium",
            tags : [node , IDsPerTag[node]],
            name: node,
        })
    })

    let deerTag = new TagGroupModel({
        color: "#43A047",
        icon: "mdiHorseVariant",
        tags : ['B3 6D AF 03'],
        name: "Deer",
    })
    await deerTag.save();

    let fireflyTag = new TagGroupModel({
        color: "#7E57C2",
        icon: "mdiBee",
        tags : ['F3 60 04 98'],
        name: "Firefly",
    })
    await fireflyTag.save();
    let jellyfishTag = new TagGroupModel({
        color: "#2196F3",
        icon: "mdiJellyfish",
        tags : ['53 E3 4D 1F'],
        name: "Jellyfish",
    })
    await jellyfishTag.save();
    let crowTag = new TagGroupModel({
        color: "#00BCD4",
        icon: "mdiBird",
        tags : ['13 5E 0A 98'],
        name: "Crow",
    })
    await crowTag.save();
    let snakeTag = new TagGroupModel({
        color: "#F44336",
        icon: "mdiSnake",
        tags : ["F3 B7 3B 1F"],
        name: "Snake",
    })
    await snakeTag.save();


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

    let demoPuzzleTemplate = new PuzzleTemplateModel({
        solutions: [
            {
                solutionName: "hide",
                perReaderRequirements: {
                    "R1" : { oneOf: [diamondGroup._id.toString()]},
                    "R2" : { oneOf: [ diamondGroup._id.toString()]},
                    "R3" : { oneOf: [ diamondGroup._id.toString()]},
                }
            },
            {
                solutionName: "order 1",
                perReaderRequirements: {
                    "R1" : { oneOf: [jellyfishTag._id.toString()]},
                    "R2" : { oneOf: [ fireflyTag._id.toString()]},
                    "R3" : { oneOf: [ crowTag._id.toString()]},
                }
            },
        ],
        name: "Demo Puzzle",
        description: "first puzzle ever",
        readerNamesBySlotID: {
             "R1" : "reader 1",
             "R2" : "reader 2",
             "R3" : "reader 3",
        }
    });
    await demoPuzzleTemplate.save();

    let demoImplementation = new PuzzleImplementationModel({
        name: "demo implementation",
        puzzleTemplate : demoPuzzleTemplate._id,
        assignedReaders: {
            "R1" :"C0:3F:C0:55:B5:94",
            "R2": "B4:70:9C:25:BF:58",
            "R3": "A0:1D:AC:84:21:78",
        },
        action: "open box",
    });
    await demoImplementation.save();


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
            "redReader": "34:AF:9C:25:BF:58",
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