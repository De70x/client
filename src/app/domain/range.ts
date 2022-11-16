import { ComboType } from "./combo";
import {ActionType} from "./action";

export type RangeType = {
  id: number;
  libelle: string;
  combos: ComboType[];
  actions: ActionType[];
};
