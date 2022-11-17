import {RangeType} from "../domain/range";
import {ActionType} from "../domain/action";
import {ComboType} from "../domain/combo";
import {mainsDepart} from "../domain/enum/combos";

export const trierCouleursLegendes = (c1: ActionType, c2: ActionType) => {
    return c2.action_id - c1.action_id;
};

export const trierRanges = (r1: RangeType, r2: RangeType) => {
    return r2.range_id - r1.range_id;
};

export const trierCombos = (c1:ComboType, c2: ComboType) =>{
    const idx1 = mainsDepart.indexOf(c1.libelle);
    const idx2 = mainsDepart.indexOf(c2.libelle);

    return idx2 - idx1;
}
