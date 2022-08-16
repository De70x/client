import { CouleurType } from "../domain/couleur";
import { RangeType } from "../domain/range";

export const trierCouleursLegendes = (c1: CouleurType, c2: CouleurType) => {
  return c2.id - c1.id;
};

export const trierRanges = (r1: RangeType, r2: RangeType) => {
  return r2.id - r1.id;
};
