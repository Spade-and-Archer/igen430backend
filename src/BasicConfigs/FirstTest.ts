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

    let lavenderTag = new TagGroupModel({
        color: "rgb(123, 31, 162)",
        icon: "mdiFlower",
        tags : ["04 19 CF 7A B6 2A 81"],
        name: "Lavender",
    })
    await lavenderTag.save();

    let daisyTag = new TagGroupModel({
        color: "rgb(255, 215, 64)",
        icon: "mdiFlower",
        tags : ["04 FF CE 7A B6 2A 81"],
        name: "Daisy",
    })
    await daisyTag.save();

    let butterflyFlowerTag = new TagGroupModel({
        color: "rgb(68, 138, 255)",
        icon: "mdiFlower",
        tags : ["04 8E 4B 7C B6 2A 81"],
        name: "Butterfly Flower",
    })
    await butterflyFlowerTag.save();

    let thistleTag = new TagGroupModel({
        color: "rgb(123, 31, 162)",
        icon: "mdiFlowerPoppy",
        tags : ["04 24 CF 7A B6 2A 81"],
        name: "Thistle",
    })
    await thistleTag.save();

    let roseHipTag = new TagGroupModel({
        color: "rgb(244, 67, 54)",
        icon: "mdiFlowerPoppy",
        tags : ["04 18 CF 7A B6 2A 81"],
        name: "RoseHip",
    })
    await roseHipTag.save();

    let whiteDropTag = new TagGroupModel({
        color: "dark-grey",
        icon: "mdiWater",
        tags : ["04 13 CF 7A B6 2A 81"],
        name: "White Drop",
    })
    await whiteDropTag.save();

    let yellowDropTag = new TagGroupModel({
        color: "rgb(255, 215, 64)",
        icon: "mdiWater",
        tags : ["04 11 CF 7A B6 2A 81"],
        name: "Yellow Drop",
    })
    await yellowDropTag.save();

    let blueDropTag = new TagGroupModel({
        color: "rgb(68, 138, 255)",
        icon: "mdiWater",
        tags : ["04 12 CF 7A B6 2A 81"],
        name: "Blue Drop",
    })
    await blueDropTag.save();

    let rootTag = new TagGroupModel({
        color: "rgb(93, 64, 55)",
        icon: "mdiTree",
        tags : ["04 1B CF 7A B6 2A 81"],
        name: "Root",
    })
    await rootTag.save();

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

    let alphaTags = {
        "X" :  '04 F8 CE 7A B6 2A 81',
        "A" :  '04 F2 CE 7A B6 2A 81',
        "T" :  '04 ED CE 7A B6 2A 81',
        "R" :  '04 76 E6 7A B6 2A 81',
        "C" :  '04 EF CE 7A B6 2A 81',
        "J" :  '04 F7 CE 7A B6 2A 81',
        "V" :  '04 FA CE 7A B6 2A 81',
        "H" :  '04 EE CE 7A B6 2A 81',
        "F" :  '04 7D E6 7A B6 2A 81',
        "Q" :  '04 E6 CE 7A B6 2A 81',
        "B" :  '04 E4 CE 7A B6 2A 81',
        "W" :  '04 F1 CE 7A B6 2A 81',
        "Y" :  '04 F9 CE 7A B6 2A 81',
        "M" :  '04 8D 4B 7C B6 2A 81',
        "D" :  '04 77 E6 7A B6 2A 81',
        "E" :  '0 4 7C E6 7A B6 2A 8',
        "G" :  '04 7E E6 7A B6 2A 81',
        "K" :  '04 F5 CE 7A B6 2A 81',
        "L" :  '04 EC CE 7A B6 2A 81',
        "N" :  '04 EA CE 7A B6 2A 81',
        "O" :  '04 FB CE 7A B6 2A 81',
        "P" :  '04 F6 CE 7A B6 2A 81',
        "S" :  '04 E5 CE 7A B6 2A 81',
        "U" :  '04 F4 CE 7A B6 2A 81',
        "Z" :  '04 FC C3 7A B6 2A 81',
        "I" :  '04 F3 CE 7A B6 2A 81',
    }
    let alphaTagIDs = {

    };

    let promises = [];
    Object.keys(alphaTags).sort() .forEach((letter)=>{
        let newTag = new TagGroupModel({
            color: "#A2722CFF",
            icon: "mdiAlpha" + letter,
            tags : [alphaTags[letter]],
            name: "Letter  " + letter,
        })
        promises.push(newTag.save().then((r)=>{
            alphaTagIDs[letter] = r._id.toString()
        }))
    })
    while(promises.length > 0){
        await promises.pop();
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
            {
                solutionName: "IGEN",
                perReaderRequirements: {
                    "R1" : { oneOf: [alphaTagIDs["I"]]},
                    "R2" : { oneOf: [ alphaTagIDs["G"]]},
                    "R3" : { oneOf: [  alphaTagIDs["E"]]},
               //     "R4" : { oneOf: [  alphaTagIDs["N"]]},
                }
            },
        ],
        name: "Demo Puzzle",
        description: "first puzzle ever",
        readerNamesBySlotID: {
             "R1" : "reader 1",
             "R2" : "reader 2",
             "R3" : "reader 3",
             //"R4" : "reader 4",
        }
    });
    await demoPuzzleTemplate.save();

    let potionPuzzle = new PuzzleTemplateModel({
        solutions: [
            {
                solutionName: "Blood of the fallen",
                perReaderRequirements: {
                    "R1" : { oneOf: [roseHipTag._id.toString()]},
                    "R2" : { oneOf: [ rootTag._id.toString()]},
                    "R3" : { oneOf: [ blueDropTag._id.toString()]},
                 //   "R4" : { oneOf: [ yellowDropTag._id.toString()]},
                }
            },
            {
                solutionName: "Pan's Syrup",
                perReaderRequirements: {
                    "R1" : { oneOf: [ daisyTag._id.toString()]},
                    "R2" : { oneOf: [ fireflyTag._id.toString()]},
                    "R3" : { oneOf: [ whiteDropTag._id.toString()]},
              //      "R4" : { oneOf: [ yellowDropTag._id.toString()]},
                }
            },
            {
                solutionName: "Step Skyward",
                perReaderRequirements: {
                    "R1" : { oneOf: [ lavenderTag._id.toString()]},
                    "R2" : { oneOf: [ butterflyFlowerTag._id.toString()]},
                    "R3" : { oneOf: [ blueDropTag._id.toString()]},
                //    "R4" : { oneOf: [ whiteDropTag._id.toString()]},
                }
            },
            {
                solutionName: "A Sip Of The Moon",
                perReaderRequirements: {
                    "R1" : { oneOf: [ lavenderTag._id.toString()]},
                    "R2" : { oneOf: [ thistleTag._id.toString()]},
                    "R3" : { oneOf: [ yellowDropTag._id.toString()]},
              //      "R4" : { oneOf: [ blueDropTag._id.toString()]},
                }
            },
        ],
        name: "Potion Puzzle",
        description: "first puzzle ever",
        readerNamesBySlotID: {
            "R1" : "Top Right",
            "R2" : "Bot Left",
            "R3" : "Top left",
           // "R4" : "reader 4",
        }
    });
    await potionPuzzle.save();


    let potionImplementation = new PuzzleImplementationModel({
        name: "potion implementation",
        puzzleTemplate : potionPuzzle._id,
        assignedReaders: {
            "R1" :"C0:3F:C0:55:B5:94",
            "R2": "B4:70:9C:25:BF:58",
            "R3": "A0:1D:AC:84:21:78",
       //     "R4": "34:AF:9C:25:BF:58",
        },
        action: "reveal potion",
    });
    await potionImplementation.save();


    let demoImplementation = new PuzzleImplementationModel({
        name: "demo implementation",
        puzzleTemplate : demoPuzzleTemplate._id,
        assignedReaders: {
            "R1" :"C0:3F:C0:55:B5:94",
            "R2": "B4:70:9C:25:BF:58",
            "R3": "A0:1D:AC:84:21:78",
         //   "R4": "34:AF:9C:25:BF:58",
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