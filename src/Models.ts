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
    @prop({ required: true, default: []})
    tags: string[];
}

export const TagGroupModel = getModelForClass(TagGroup);

export class PuzzleSolution {
    @prop({ required: true })
    solutionName: string;
    @prop({ required: true })
    perReaderRequirements: Record<string, RequirementsOptions>
}
class PuzzleTemplate {
    @prop({ required: true })
    solutions: PuzzleSolution[];
    @prop({ required: true })
    name: string;
    @prop({ required: false })
    description: string;
    @prop({ required: true })
    readerNamesBySlotID: Record<string, string>;
    isSolved(tagsPerReader:  Record<string, string>){
        let satisfiedSolName :string | boolean = false;
        let solved = this.solutions.some((sol)=>{
            let didSolutionFail = false;
            Object.keys(sol.perReaderRequirements).forEach((k)=>{
                let requirements = sol.perReaderRequirements[k];
                let curTags = tagsPerReader[k];
                if(curTags){
                    if(requirements.oneOf && requirements.oneOf.length > 0){
                        if(!doesArrayOfOptionsIncludeTag(requirements.oneOf, curTags)){
                            didSolutionFail = true;
                            return;
                        }
                    }
                    if(requirements.not && requirements.not.length > 0){
                        if(doesArrayOfOptionsIncludeTag(requirements.not, curTags)){
                            didSolutionFail = true;
                            return;
                        }
                    }
                }else{
                    didSolutionFail = true;
                }
            })
            if(!didSolutionFail){
                satisfiedSolName = sol.solutionName
            }
            return !didSolutionFail
        })
        return satisfiedSolName


    }
}

export const PuzzleTemplateModel = getModelForClass(PuzzleTemplate);

class PuzzleImplementation {
    @prop({ required: false, default: "unnamed" })
    name: string ;
    @prop({ required: true, ref: () => PuzzleTemplate })
    puzzleTemplate: Ref<PuzzleTemplate> ;
    @prop({ required: true })
    assignedReaders: Record<string, string>;
    async checkImplementation() : Promise<boolean | string>{
        let template = (await PuzzleTemplateModel.findById( this.puzzleTemplate))
        let tagsPerReader = {};
        let promises = [];
        Object.keys(this.assignedReaders).forEach((k)=>{
            let readerKey = k;
            let readerUID = this.assignedReaders[k];
            let currentTagOnReader = stateMap[readerUID];
            promises.push(TagGroupModel.find({tags: currentTagOnReader} ).then((r)=>{
                if(r.length > 0){
                    tagsPerReader[readerKey] = [currentTagOnReader, ...r.map((tagGroup)=>{
                        return tagGroup._id.toString();
                    })]
                }
                else{
                    tagsPerReader[readerKey] = [currentTagOnReader]
                }
            }))
            // promises.push(TagModel.find({node_id: currentTagOnReader}).then((r)=>{
            //     if(r[0] && r[0].tagGroups){
            //         tagsPerReader[readerKey] = [currentTagOnReader, ...r[0].tagGroups]
            //     }
            //     else{
            //         tagsPerReader[readerKey] = [currentTagOnReader]
            //     }
            // }))
        })
        while(promises.length > 0){
            await promises.pop();
        }
        return template.isSolved(tagsPerReader)
    }
    @prop({ required: false })
    action: string;
}

export const PuzzleImplementationModel = getModelForClass(PuzzleImplementation);
