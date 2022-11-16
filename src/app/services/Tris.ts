import {RangeType} from "../domain/range";
import {ActionType} from "../domain/action";

export const trierCouleursLegendes = (c1: ActionType, c2: ActionType) => {
    return c2.action_id - c1.action_id;
};

export const trierRanges = (r1: RangeType, r2: RangeType) => {
    return r2.id - r1.id;
};
