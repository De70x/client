export type CouleurType = {
  id: number;
  libelle: string;
  valeur: string;
  legendeId: number;
};

export const NouvelleCouleur: CouleurType = {
  id: -1,
  libelle: "Couleur",
  valeur: "#8FFF41",
  legendeId:-1,
};
