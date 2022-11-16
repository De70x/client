import React, { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import {
  setCouleurActive,
  changerCouleur,
  rangeActiveSelector,
  supprimerCouleur,
} from "../../app/reducers/ranges/rangeActive.slice";
import {ActionType} from "../../app/domain/action";

interface ICouleur {
  couleur: ActionType;
}

const Couleur: React.FC<ICouleur> = ({ couleur }) => {
  const dispatch = useAppDispatch();
  const { actionActive } =
    useAppSelector(rangeActiveSelector).rangeActiveReducer;
  let couleurSauv: ActionType = actionActive;
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [texte, setTexte] = useState(couleur.libelle);

  // On passe par une étape intermédiaire pour des raisons de performance
  // si on faisait un update du state ou de la ase à chaque variation de couleur
  // on aurait de gros ralentissement.
  const changeCouleur = (
    e: ChangeEvent<HTMLInputElement>,
    couleur: ActionType
  ) => {
    dispatch(setCouleurActive(couleur));
    couleurSauv = { ...couleur, couleur: e.target.value };
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
    <label key={couleur.action_id} className="couleur">
      <input
        type="radio"
        name="couleurActive"
        value={couleur.action_id}
        onChange={(e) => {
          changementCouleur(e);
        }}
        checked={couleur.action_id === actionActive?.action_id}
      />
      <input type="text" ref={inputRef} value={texte} onChange={changerTexte} />
      <input
        type="color"
        value={couleur.couleur}
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
