import React, {createRef, PointerEvent, useEffect, useRef, useState} from "react";
import {RangeType} from "../../app/domain/range";
import {useAppDispatch} from "../../app/hooks/hooks";
import {fetchRanges} from "../../app/reducers/ranges/range.slice";
import {
    sauvegarderRange,
    setRangeActive,
} from "../../app/reducers/ranges/rangeActive.slice";
import "../../css/ranges/DetailRange.css";
import Combo from "../combos/Combo";
import Couleur from "../couleurs/Couleur";

interface IRange {
    range: RangeType;
}

const DetailRange: React.FC<IRange> = ({range}) => {
    const [painting, setPainting] = useState(false);
    const dispatch = useAppDispatch();
    const refs: Array<React.RefObject<any>> = [];
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [texte, setTexte] = useState(range.libelle);

    useEffect(() => {
        setTexte(range.libelle);
    }, [range.libelle]);

    range.combos.forEach((c) => {
        const comboRef = createRef<any>();
        refs.push(comboRef);
    });

    const changerTexte = () => {
        setTexte(inputRef.current.value);
    };

    const sauverRange = () => {
        range = {...range, libelle: texte};
        dispatch(sauvegarderRange(range));
        dispatch(fetchRanges());
        dispatch(setRangeActive(range));
    };

    const grille = document.getElementById("grille");
    const paint = (e: PointerEvent) => {
        if (painting && grille) {
            const x = Math.floor((e.clientX - grille.offsetLeft) / 52);
            const y = Math.floor((e.clientY - grille.offsetTop) / 52);
            const indice = y * 13 + x;
            const currentRef = refs[indice];
            currentRef.current.paintColor();
        }
    };

    const pointerDown = (e: PointerEvent) => {
        setPainting(true);
        grille?.setPointerCapture(e.pointerId);
    };

    if (range == null) {
        return <>Aucune Range n'est sélectionnée</>;
    } else {
        return (
            <div className="detailRange">
                <input type="text" ref={inputRef} value={texte} onChange={changerTexte}/>
                <div
                    id="grille"
                    className="grille"
                    onPointerDown={pointerDown}
                    onPointerUp={() => setPainting(false)}
                    onPointerMove={paint}
                >
                    {range.combos.map((c) => {
                        return <Combo combo={c} key={c.id} ref={refs[c.idx]}/>;
                    })}
                </div>
                <div className="legende">
                    {range.actions.map(a=>{
                        return <Couleur couleur={a}/>;
                    })}
                </div>
                {range.id !== -1 && (
                    <button onClick={() => sauverRange()}>Sauvegarder</button>
                )}
            </div>
        );
    }

};

export default DetailRange;
