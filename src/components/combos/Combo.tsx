import React, { MouseEvent, useImperativeHandle, useState } from "react";
import { ComboType } from "../../app/domain/combo";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";

import {
  changerCouleursCombo,
  rangeActiveSelector,
  retirerCouleursCombo,
} from "../../app/reducers/ranges/rangeActive.slice";

import { inverseCouleur } from "../../app/services/Couleurs";
import {ActionType} from "../../app/domain/action";

interface ICombo {
  combo: ComboType;
}

const Combo = React.forwardRef<any, ICombo>(({ combo }, ref) => {
  let styleDepart = {};
  let styleTexteDepart = {};

  const couleursCombo = combo.actions;
  if (couleursCombo.length === 1) {
    const couleurDepart = combo.actions[0];
    if (couleurDepart.couleur) {
      styleDepart = {
        background: couleurDepart.couleur,
      };
      styleTexteDepart = {
        color: inverseCouleur(couleurDepart.couleur),
      };
    }
  } else if (couleursCombo.length > 1) {
    const couleur1 = combo.actions[0];
    const couleur2 = combo.actions[1];
    if (couleur1.couleur && couleur2.couleur) {
      const degrade = `linear-gradient(180deg, ${couleur1.couleur} 0%, ${couleur2.couleur} 100%)`;
      styleDepart = {
        background: degrade,
      };
      styleTexteDepart = {
        color: inverseCouleur(couleur1.couleur),
      };
    }
  }

  const ajouterStyle = (couleurAAjouter: ActionType) => {
    const couleursCombo = combo.actions;
    const style = {
      bgColor: { background: "" },
      txtColor: { color: "" },
    };

    if (couleursCombo.length === 0) {
      style.bgColor.background = couleurAAjouter.couleur;
      style.txtColor.color = inverseCouleur(couleurAAjouter.couleur);
    }
    if (couleursCombo.length >= 1) {
      const couleur1 = combo.actions[0];
      if (couleur1.couleur) {
        const degrade = `linear-gradient(180deg, ${couleur1.couleur} 0%, ${couleurAAjouter} 100%)`;
        style.bgColor.background = degrade;
        style.txtColor.color = inverseCouleur(couleur1.couleur);
      }
    }

    return style;
  };

  const [style, setStyle] = useState(styleDepart);
  const [styleTexte, setStyleTexte] = useState(styleTexteDepart);
  const dispatch = useAppDispatch();
  const { actionActive } =
    useAppSelector(rangeActiveSelector).rangeActiveReducer;

  const appliquerCouleur = () => {
    setStyle(ajouterStyle(actionActive).bgColor);
    setStyleTexte(ajouterStyle(actionActive).txtColor);
    dispatch(
      changerCouleursCombo({
        combo_id: combo.id,
        action_id: actionActive.action_id,
        frequence: 100,
      })
    );
  };

  useImperativeHandle(ref, () => ({
    paintColor() {
      appliquerCouleur();
    },
  }));

  const retirerCouleur = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(retirerCouleursCombo(combo.id));
    setStyle({});
    setStyleTexte({ color: "#000" });
  };

  return (
    <div
      ref={ref}
      className="combo"
      onClick={() => {
        appliquerCouleur();
      }}
      onContextMenu={(e) => {
        retirerCouleur(e);
      }}
      style={style}
    >
      <span className="texteCombo" style={styleTexte}>
        {combo.libelle}
      </span>
    </div>
  );
});

export default Combo;
