import React, { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import { CouleurType } from "../../app/domain/couleur";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import {
  setCouleurActive,
  changerCouleur,
  rangeActiveSelector,
  supprimerCouleur,
} from "../../app/reducers/ranges/rangeActive.slice";

interface ICouleur {
  couleur: CouleurType;
}

const Couleur: React.FC<ICouleur> = ({ couleur }) => {
  const dispatch = useAppDispatch();
  const { couleurActive } =
    useAppSelector(rangeActiveSelector).rangeActiveReducer;
  let couleurSauv: CouleurType = couleurActive;
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [texte, setTexte] = useState(couleur.libelle);

  // On passe par une étape intermédiaire pour des raisons de performance
  // si on faisait un update du state ou de la ase à chaque variation de couleur
  // on aurait de gros ralentissement.
  const changeCouleur = (
    e: ChangeEvent<HTMLInputElement>,
    couleur: CouleurType
  ) => {
    dispatch(setCouleurActive(couleur));
    couleurSauv = { ...couleur, valeur: e.target.value };
  };

  const sauverCouleur = () => {
    dispatch(changerCouleur(couleurSauv));
  };

  const changementCouleur = (e: SyntheticEvent<HTMLInputElement, Event>) => {
    dispatch(setCouleurActive(couleur));
  };

  const changerTexte = () => {
    setTexte(inputRef.current.value);
    couleurSauv = { ...couleur, libelle: inputRef.current.value };
    dispatch(changerCouleur(couleurSauv));
  };

  const supprCouleur = () => {
    dispatch(supprimerCouleur(couleur));
  };

  return (
    <label key={couleur.id} className="couleur">
      <input
        type="radio"
        name="couleurActive"
        value={couleur.id}
        onChange={(e) => {
          changementCouleur(e);
        }}
        checked={couleur.id === couleurActive?.id}
      />
      <input type="text" ref={inputRef} value={texte} onChange={changerTexte} />
      <input
        type="color"
        value={couleur.valeur}
        onChange={(e) => changeCouleur(e, couleur)}
        onBlur={() => {
          sauverCouleur();
        }}
      />
      <button onClick={supprCouleur}>x</button>
    </label>
  );
};

export default Couleur;
