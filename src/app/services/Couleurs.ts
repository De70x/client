export const inverseCouleur = (couleur: string) => {
  // On vire le # si besoin
  const codeHexa = couleur.length > 6  ? couleur.substring(1) : couleur;
  const c = parseInt(codeHexa, 16);
  const ancienR = (c >> 16) & 0xff;
  const ancienG = (c >> 8) & 0xff;
  const ancienB = (c >> 0) & 0xff;

  const r = 255 - ancienR;
  const g = 255 - ancienG;
  const b = 255 - ancienB;

  return `rgb(${r},${g},${b})`;
};
