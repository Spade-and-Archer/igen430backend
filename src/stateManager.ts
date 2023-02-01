type deviceState = {
    
}
let stateMap = {
    
};
let tagGroupsPerTag = {

};

type RequirementsOptions = {
    oneOf: (string | "any" | "noTag") [], 
    not: (string | "any" | "noTag") [],
}
function doesArrayOfOptionsIncludeTag(options, curTag){
    if(options.includes("any") ){
        return true;
    }
    //if the current tag is included in the not, it can't be valid;
    else if(options.includes(curTag)){
        return true;
    }
    //if any of the groups the current tag is in are valid, we are succssful
    else if(tagGroupsPerTag[curTag] && tagGroupsPerTag[curTag].some((tg)=>{options.includes(tg)}) ){
        return true;
    }
    //if none of the above are true, we have failed.
    else{
        return false
    }
}
class TagGroup {
    name: string;
    registeredTagIDs: string[];
    icon: string;
    color: string;
}
class PuzzleSolution {
    solutionName: string;
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
class PuzzleTemplate {
    solutions: PuzzleSolution[];
    name: string;
    description: string;
    readerNamesBySlotID: Record<string, string>;
}
class puzzleImplementation {
    puzzleTemplate: PuzzleTemplate ;
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

export const getTagReading = (tag)=>{
    return stateMap[tag];
}

