export const inverseCouleur = (couleur: string) => {
  const codeHexa = couleur.substring(1);
  const c = parseInt(codeHexa, 16);
  const ancienR = (c >> 16) & 0xff;
  const ancienG = (c >> 8) & 0xff;
  const ancienB = (c >> 0) & 0xff;

  const r = 255 - ancienR;
  const g = 255 - ancienG;
  const b = 255 - ancienB;

  return `rgb(${r},${g},${b})`;
};
