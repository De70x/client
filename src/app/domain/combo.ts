import {ActionType} from "./action";

export type ComboType = {
    combo_id: number;
    libelle: string;
    actions: ActionType[];
    idx: number;
};
