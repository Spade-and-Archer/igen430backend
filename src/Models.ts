import {getModelForClass, prop, Ref} from "@typegoose/typegoose";
import {doesArrayOfOptionsIncludeTag, stateMap} from "./stateManager";

export type RequirementsOptions = {
    oneOf: (string | "any" | "noTag") [],
    not: (string | "any" | "noTag") [],
}


export class Tag {
    @prop({ required: true })
    name: string;
    @prop({ required: true , default: []})
    tagGroups: Ref<TagGroup>[];
    @prop({ required: false , default: ""})
    icon: string;
    @prop({ required: true , default: "#000000"})
    color: string;
    @prop({ required: true, unique: true })
    node_id: string;
}

export const TagModel = getModelForClass(Tag);

export class TagGroup {
    @prop({ required: true })
    name: string;
    @prop({ required: false , default: ""})
    icon: string;
    @prop({ required: true , default: "#000000"})
    color: string;
}


export const TagGroupModel = getModelForClass(TagGroup);

export class PuzzleSolution {
    @prop({ required: true })
    solutionName: string;
    @prop({ required: true })
    perReaderRequirements: Record<string, RequirementsOptions>


    isSolved(tagsPerReader:  Record<string, string>){
        let failure = false;
        Object.keys(this.perReaderRequirements).forEach((k)=>{
            let requirements = this.perReaderRequirements[k];
            let curTags = tagsPerReader[k];
            if(curTags){
                if(requirements.oneOf && requirements.oneOf.length > 0){
                    if(!doesArrayOfOptionsIncludeTag(requirements.oneOf, curTags)){
                        failure = true;
                        return;
                    }
                }
                if(requirements.not && requirements.not.length > 0){
                    if(doesArrayOfOptionsIncludeTag(requirements.not, curTags)){
                        failure = true;
                        return;
                    }
                }
            }else{
                failure = true;
            }
        })
        return !failure;

    }
}

export const PuzzleSolutionModel = getModelForClass(PuzzleSolution);

class PuzzleTemplate {
    @prop({ required: true })
    solutions: PuzzleSolution[];
    @prop({ required: true })
    name: string;
    @prop({ required: false })
    description: string;
    @prop({ required: true })
    readerNamesBySlotID: Record<string, string>;
}

export const PuzzleTemplateModel = getModelForClass(PuzzleTemplate);

class PuzzleImplementation {
    @prop({ required: true, ref: () => PuzzleTemplate })
    puzzleTemplate: Ref<PuzzleTemplate>[] ;
    @prop({ required: true })
    assignedReaders: Record<string, string>;
    async checkImplementation(){
        let solved = false;
        let solutions = (await PuzzleTemplateModel.findById( this.puzzleTemplate)).solutions
        let tagsPerReader = {};
        let promises = [];
        Object.keys(this.assignedReaders).forEach((k)=>{
            let readerKey = k;
            let readerUID = this.assignedReaders[k];
            let currentTagOnReader = stateMap[readerUID];

            promises.push(TagModel.find({node_id: currentTagOnReader}).then((r)=>{
                if(r[0] && r[0].tagGroups){
                    tagsPerReader[readerKey] = [currentTagOnReader, ...r[0].tagGroups]
                }
                else{
                    tagsPerReader[readerKey] = [currentTagOnReader]
                }
            }))
        })
        while(promises.length > 0){
            await promises.pop();
        }
        solutions.forEach((sol)=>{
            if(sol.isSolved(tagsPerReader)){
                solved = true;
            }
        })
        return solved;
    }
}

export const PuzzleImplementationModel = getModelForClass(PuzzleImplementation);