import { ComboType } from "./combo";
import {ActionType} from "./action";

export type RangeType = {
  range_id: number;
  libelle: string;
  combos: ComboType[];
  actions: ActionType[];
};
