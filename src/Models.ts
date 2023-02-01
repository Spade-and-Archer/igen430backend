import {getModelForClass, prop} from "@typegoose/typegoose";
import {doesArrayOfOptionsIncludeTag, stateMap} from "./stateManager";

export type RequirementsOptions = {
    oneOf: (string | "any" | "noTag") [],
    not: (string | "any" | "noTag") [],
}


export class TagGroup {
    @prop({ required: true })
    name: string;
    @prop({ required: true , default: []})
    registeredTagIDs: string[];
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


    isSolved(assignedReaders:  Record<string, string>){
        let failure = false;
        Object.keys(this.perReaderRequirements).forEach((k)=>{
            let requirements = this.perReaderRequirements[k];
            let curTag = stateMap[assignedReaders[k]];
            if(curTag){
                if(requirements.oneOf && requirements.oneOf.length > 0){
                    if(!doesArrayOfOptionsIncludeTag(requirements.oneOf, curTag)){
                        failure = true;
                        return;
                    }

                }
                if(requirements.not && requirements.not.length > 0){
                    if(doesArrayOfOptionsIncludeTag(requirements.not, curTag)){
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
    puzzleTemplate: PuzzleTemplate ;
    @prop({ required: true })
    assignedReaders: Record<string, string>;
    checkImplementation(){
        let solved = false;
        this.puzzleTemplate.solutions.forEach((sol)=>{
            if(sol.isSolved(this.assignedReaders)){
                solved = true;
            }
        })
        return solved;
    }
}

export const PuzzleImplementationModel = getModelForClass(PuzzleImplementation);
