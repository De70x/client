import { ComboType } from "./combo";
import { LegendeType } from "./legende";

export type RangeType = {
  id: number;
  libelle: string;
  combos: ComboType[];
  legende: LegendeType;
};
