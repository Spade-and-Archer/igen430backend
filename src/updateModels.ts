import {RequestHandler} from "express";
import {PuzzleImplementationModel, PuzzleTemplateModel, TagGroupModel} from "./Models";

export const addOrEditPuzzleTemplate: RequestHandler = async (req, res) => {
    if(req.params.id){
        let puzzleToEdit = await PuzzleTemplateModel.findById(req.params.id);
        if(puzzleToEdit){
            puzzleToEdit.name = req.body.name || puzzleToEdit.name;
            puzzleToEdit.description = req.body.description || puzzleToEdit.description;
            puzzleToEdit.solutions = req.body.solutions || puzzleToEdit.solutions;
            puzzleToEdit.readerNamesBySlotID = req.body.readerNamesBySlotID || puzzleToEdit.readerNamesBySlotID;
            await puzzleToEdit.save().then(()=>{
                res.status(200).send(puzzleToEdit);
            }).catch((e)=>{
                console.warn('error saving puzzle template changes:')
                console.warn(JSON.stringify(req.body))
                console.warn(e);
                res.status(400).send();
            })
        }
        else{
            res.status(404).send({message: "no puzzle with that ID"});
            console.warn(`cannot edit puzzle with id ${req.params.id} as it doesn't exist`);
        }
        return;
    }
    let newPuzzle = new PuzzleTemplateModel({
        name: req.body.name,
        solutions: req.body.solutions || [],
        readerNamesBySlotID : req.body.readerNamesBySlotID || {}
    });
    if(req.body.description){
        newPuzzle.description = req.body.description;
    }
    await newPuzzle.save().then(()=>{
        res.status(200).send(newPuzzle);
    }).catch((e)=>{
        console.warn('error saving new puzzle:')
        console.warn(JSON.stringify(req.body))
        console.warn(e);
        res.status(400).send();
    });



};

export const deletePuzzleTemplate: RequestHandler = async (req, res) => {
    if(req.params.id){
        await PuzzleTemplateModel.deleteOne({_id: req.params.id});
        res.status(200).send()

        return;
    }
};

export const addOrEditTagGroup: RequestHandler = async (req, res) => {
    if (req.params.id) {
        let tagGroupToEdit = await TagGroupModel.findById(req.params.id);
        if (tagGroupToEdit) {
            tagGroupToEdit.name = req.body.name || tagGroupToEdit.name;
            tagGroupToEdit.icon = req.body.icon || tagGroupToEdit.icon;
            tagGroupToEdit.color = req.body.color || tagGroupToEdit.color;
            tagGroupToEdit.tags = req.body.tags || tagGroupToEdit.tags;
            await tagGroupToEdit.save().then(() => {
                res.status(200).send(tagGroupToEdit);
            }).catch((e) => {
                console.warn('error saving tag group changes:');
                console.warn(JSON.stringify(req.body));
                console.warn(e);
                res.status(400).send();
            });
        } else {
            res.status(404).send({ message: "no tag group with that ID" });
            console.warn(`cannot edit tag group with id ${req.params.id} as it doesn't exist`);
        }
        return;
    }
    let newTagGroup = new TagGroupModel({
        name: req.body.name,
        icon: req.body.icon || '',
        color: req.body.color || '#000000',
        tags: req.body.tags || []
    });
    await newTagGroup.save().then(() => {
        res.status(200).send(newTagGroup);
    }).catch((e) => {
        console.warn('error saving new tag group:');
        console.warn(JSON.stringify(req.body));
        console.warn(e);
        res.status(400).send();
    });
};


export const addOrEditPuzzleImplementation: RequestHandler = async (req, res) => {
    if (req.params.id) {
        let  puzzleImplementationToEdit = await PuzzleImplementationModel.findById(req.params.id);
        if (puzzleImplementationToEdit) {
            puzzleImplementationToEdit.name = req.body.name || puzzleImplementationToEdit.name;
            puzzleImplementationToEdit.assignedReaders = req.body.assignedReaders || puzzleImplementationToEdit.assignedReaders;
            puzzleImplementationToEdit.puzzleTemplate = req.body.puzzleTemplate || puzzleImplementationToEdit.puzzleTemplate;
            await  puzzleImplementationToEdit.save().then(() => {
                res.status(200).send(puzzleImplementationToEdit);
            }).catch((e) => {
                console.warn('error saving puzzle imp changes:');
                console.warn(JSON.stringify(req.body));
                console.warn(e);
                res.status(400).send();
            });
        } else {
            res.status(404).send({ message: "no tag group with that ID" });
            console.warn(`cannot edit tag group with id ${req.params.id} as it doesn't exist`);
        }
        return;
    }
    let newPuzzleImplementation = new PuzzleImplementationModel({
        name: req.body.name,
        assignedReaders: req.body.assignedReaders,
        puzzleTemplate: req.body.puzzleTemplate
    });
    await newPuzzleImplementation.save().then(() => {
        res.status(200).send(newPuzzleImplementation);
    }).catch((e) => {
        console.warn('error saving new newPuzzleImplementation:');
        console.warn(JSON.stringify(req.body));
        console.warn(e);
        res.status(400).send();
    });
};


