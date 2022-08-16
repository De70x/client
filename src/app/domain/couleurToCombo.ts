import { CouleurType } from "./couleur";

export type CouleurToComboType = {
  id: number;
  comboId: number;
  couleurId: number;
  couleur?: CouleurType;
  pourcentage: number;
};
