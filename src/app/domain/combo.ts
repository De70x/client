import {ActionType} from "./action";

export type ComboType = {
    id: number;
    libelle: string;
    actions: ActionType[];
    idx: number;
};
