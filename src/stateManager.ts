type deviceState = {
    
}
export const stateMap = {
    // "80:F0:3A:25:BF:58" : "53 E3 4D 1F",
    // "A0:1D:AC:84:21:78" : "F3 60 04 98",
    // "C0:3F:C0:55:B5:94" : "13 5E 0A 98",

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
    if(curTags.some((tag)=>{return options.includes(tag)})){
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

