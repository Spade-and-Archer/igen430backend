Schemas:

``` typescript
type TagID = string;
type ActuatorID = string;
type SensorID = string;
type timeInSeconds = number;
type Condition = {
    sensorID: SensorID,
    // for has:
    // value of null means condition is true when sensor has no tag
    // list of tagIDs means condition is true when sensor has one of the listed tags. 
    // to specify a single tag, use a list of length 1
    has: null | TagID[],
    //if true, the result of this condition will be flipped from true to false and vice versa
    invert: boolean,
    
    
    //the remaining feilds are optional stretch goals
    minTime?: timeInSeconds,//min time the tag needs to have been on the sensor, assume 0 if undefined
    maxTime?: timeInSeconds, //max time that the tag can have been on the sensor, assume infinite if undefined
    order?: null | number // all conditions with defined order must have had their conditions 
                          //fulfilled in chronological order
}
type Action = {
    actuatorID: ActuatorID,
    value: 0 | 1 // value to send to actuator. Used number instead of boolean because future actuators
                 // might have more than just on and off. e.g. could be RGB LED.
}
type Rules = {
    actions: Action[], //when all requirements are met and one or more triggers are met, the action will be executed
    requirements: Condition[], //all of these conditions must be met
    triggers: Condition[], //at least one of these conditions must be met. 
    //If there are no triggers, then action should execute when all requirements are met and ignore triggers
}


```