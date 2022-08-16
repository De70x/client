import React, { MouseEvent, useImperativeHandle, useState } from "react";
import { ComboType } from "../../app/domain/combo";
import { CouleurType } from "../../app/domain/couleur";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";

import {
  changerCouleursCombo,
  rangeActiveSelector,
  retirerCouleursCombo,
} from "../../app/reducers/ranges/rangeActive.slice";

import { inverseCouleur } from "../../app/services/Couleurs";

interface ICombo {
  combo: ComboType;
}

const Combo = React.forwardRef<any, ICombo>(({ combo }, ref) => {
  let styleDepart = {};
  let styleTexteDepart = {};

  const couleursCombo = combo.couleurs;
  if (couleursCombo.length === 1) {
    const couleurDepart = combo.couleurs[0];
    if (couleurDepart.couleur) {
      styleDepart = {
        background: couleurDepart.couleur.valeur,
      };
      styleTexteDepart = {
        color: inverseCouleur(couleurDepart.couleur.valeur),
      };
    }
  } else if (couleursCombo.length > 1) {
    const couleur1 = combo.couleurs[0];
    const couleur2 = combo.couleurs[1];
    if (couleur1.couleur && couleur2.couleur) {
      const degrade = `linear-gradient(180deg, ${couleur1.couleur.valeur} 0%, ${couleur2.couleur.valeur} 100%)`;
      styleDepart = {
        background: degrade,
      };
      styleTexteDepart = {
        color: inverseCouleur(couleur1.couleur.valeur),
      };
    }
  }

  const ajouterStyle = (couleurAAjouter: CouleurType) => {
    const couleursCombo = combo.couleurs;
    const style = {
      bgColor: { background: "" },
      txtColor: { color: "" },
    };

    if (couleursCombo.length === 0) {
      style.bgColor.background = couleurAAjouter.valeur;
      style.txtColor.color = inverseCouleur(couleurAAjouter.valeur);
    }
    if (couleursCombo.length >= 1) {
      const couleur1 = combo.couleurs[0];
      if (couleur1.couleur) {
        const degrade = `linear-gradient(180deg, ${couleur1.couleur.valeur} 0%, ${couleurAAjouter.valeur} 100%)`;
        style.bgColor.background = degrade;
        style.txtColor.color = inverseCouleur(couleur1.couleur.valeur);
      }
    }

    return style;
  };

  const [style, setStyle] = useState(styleDepart);
  const [styleTexte, setStyleTexte] = useState(styleTexteDepart);
  const dispatch = useAppDispatch();
  const { couleurActive } =
    useAppSelector(rangeActiveSelector).rangeActiveReducer;

  const appliquerCouleur = () => {
    setStyle(ajouterStyle(couleurActive).bgColor);
    setStyleTexte(ajouterStyle(couleurActive).txtColor);
    dispatch(
      changerCouleursCombo({
        id: -1,
        comboId: combo.id,
        couleurId: couleurActive.id,
        pourcentage: 100,
        couleur: couleurActive,
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
