import React, {useEffect, useRef, useState} from "react";
import {RangeType} from "../../app/domain/range";
import {useAppDispatch} from "../../app/hooks/hooks";
import {fetchRanges} from "../../app/reducers/ranges/range.slice";
import {
    nouvelleCouleur,
    sauvegarderRange,
    setRangeActive,
} from "../../app/reducers/ranges/rangeActive.slice";
import "../../css/ranges/DetailRange.css";
import "../../css/legendes/Legende.css";
import Combo from "../combos/Combo";
import Couleur from "../couleurs/Couleur";
import {ActionType} from "../../app/domain/action";

interface IRange {
    range: RangeType;
}

const DetailRange: React.FC<IRange> = ({range}) => {
    const dispatch = useAppDispatch();
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [texte, setTexte] = useState(range.libelle);
    const actionDefault: Partial<ActionType> = {
        couleur: '#00FF00',
        range_id: range.range_id,
        libelle: 'Open',
    }

    useEffect(() => {
        setTexte(range.libelle);
    }, [range.libelle]);

    const changerTexte = () => {
        setTexte(inputRef.current.value);
    };

    const sauverRange = () => {
        range = {...range, libelle: texte};
        dispatch(sauvegarderRange(range));
        dispatch(fetchRanges());
        dispatch(setRangeActive(range));
    };

    const addAction = () => {
        dispatch(nouvelleCouleur(actionDefault));
    }

    if (range == null) {
        return <p>Aucune Range n'est sélectionnée</p>;
    } else {
        return (
            <div className="detailRange">
                <input type="text" ref={inputRef} value={texte} onChange={changerTexte} key={"inputLibelle"}/>
                <div
                    key={"grille"}
                    id="grille"
                    className="grille"
                >
                    {range.combos.map((c) => {
                        return <Combo combo={c} key={c.combo_id}/>;
                    })}
                </div>
                <div className="legende" key={"legende"}>
                    <div className={"listeCouleurs"}>
                        {range.actions.map(a => {
                            return <Couleur action={a}/>;
                        })}
                    </div>
                    {range.range_id !== -1 ? (
                        <button onClick={addAction} key={"ajouterAction"}>Ajouter une action</button>
                    ) : null}
                </div>
                {range.range_id !== -1 ? (
                    <button onClick={() => sauverRange()} key={"save"}>Sauvegarder</button>
                ) : null}
            </div>
        );
    }

};

export default DetailRange;
