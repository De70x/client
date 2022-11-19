import React, {ChangeEvent, SyntheticEvent, useEffect, useRef, useState} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import {
  setActionActive,
  sauverAction,
  rangeActiveSelector,
  supprimerCouleur,
} from "../../app/reducers/ranges/rangeActive.slice";
import {ActionType} from "../../app/domain/action";

interface ICouleur {
  action: ActionType;
}

const Couleur: React.FC<ICouleur> = ({ action }) => {
  const dispatch = useAppDispatch();
  const { actionActive } =
    useAppSelector(rangeActiveSelector).rangeActiveReducer;
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [texte, setTexte] = useState(action.libelle);
  const [color, setColor] = useState(action.couleur);

    /**
     * https://www.youtube.com/watch?v=YaHnww6I5Y8&t=663s
     * @param value
     * @param delay
     */
  const useDelay = (value:string,delay:number) =>{
      const [delayValue, setDelayValue] = useState(value);

      useEffect(() => {
          const timeoutId = setTimeout(()=>{
              setDelayValue(value)
          }, delay)
          return () => {
              clearTimeout(timeoutId);
          };
      }, [value]);
  }

  const colorDelayed = useDelay(color,300);

  const clickRadio = () => {
    dispatch(setActionActive(action));
  };

  const changementTexte = () => {
    setTexte(inputRef.current.value);
    action = {...action, libelle:texte}
      dispatch(sauverAction(action));
  };

  const changementCouleur = (e: React.ChangeEvent<HTMLInputElement>) =>{
      dispatch(setActionActive(action))
      setColor(e.target.value);
      action = {...action, couleur:color}
      dispatch(sauverAction(action));
  }

  const validerAction = () =>{
    dispatch(sauverAction(action));
  }

  const supprCouleur = () => {
    dispatch(supprimerCouleur(action));
  };

  return (
    <label key={action.action_id} className="couleur">
      <input
        type="radio"
        name="couleurActive"
        value={action.action_id}
        onChange={() => {
          clickRadio();
        }}
        checked={action.action_id === actionActive?.action_id}
      />
      <input type="text" ref={inputRef} value={texte} onChange={changementTexte} />
      <input
        type="color"
        value={color}
        onChange={(e) => changementCouleur(e)}
        onBlur={() => {
          validerAction();
        }}
      />
      <button onClick={supprCouleur}>x</button>
    </label>
  );
};

export default Couleur;
