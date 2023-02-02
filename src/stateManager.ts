type deviceState = {
    
}
export const stateMap = {
    
};
export const tagGroupsPerTag = {

};
type RequirementsOptions = {
    oneOf: (string | "any" | "noTag") [], 
    not: (string | "any" | "noTag") [],
}
export function doesArrayOfOptionsIncludeTag(options, curTags){
    if(options.includes("any") ){
        return true;
    }
    //if the current tag is included in the not, it can't be valid;
    else if(curTags.some((tag)=>{options.includes(tag)})){
        return true;
    }
    // //if any of the groups the current tag is in are valid, we are succssful
    // else if(tagGroupsPerTag[curTag] && tagGroupsPerTag[curTag].some((tg)=>{options.includes(tg)}) ){
    //     return true;
    // }
    //if none of the above are true, we have failed.
    else{
        return false
    }
}
export const getTagReading = (tag)=>{
    return stateMap[tag];
}

