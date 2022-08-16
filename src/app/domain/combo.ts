import { CouleurToComboType } from "./couleurToCombo";

export type ComboType = {
  id: number;
  libelle: string;
  couleurs: CouleurToComboType[];
  idx: number;
};
