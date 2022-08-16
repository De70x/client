import React, { createRef, PointerEvent, useState } from "react";
import { RangeType } from "../../app/domain/range";
import { useAppDispatch } from "../../app/hooks/hooks";
import { fetchRanges } from "../../app/reducers/ranges/range.slice";
import {
  sauvegarderRange,
  setRangeActive,
} from "../../app/reducers/ranges/rangeActive.slice";
import "../../css/ranges/DetailRange.css";
import Combo from "../combos/Combo";
import Legende from "../legendes/Legende";

interface IRange {
  range: RangeType;
}

const DetailRange: React.FC<IRange> = ({ range }) => {
  const [painting, setPainting] = useState(false);
  const dispatch = useAppDispatch();
  const refs: Array<React.RefObject<any>> = [];

  range.combos.forEach((c) => {
    const comboRef = createRef<any>();
    refs.push(comboRef);
  });

  const sauverRange = () => {
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
        <h4 className="libelleRange">{range.libelle}</h4>
        <div
          id="grille"
          className="grille"
          onPointerDown={pointerDown}
          onPointerUp={() => setPainting(false)}
          onPointerMove={paint}
        >
          {range.combos.map((c) => {
            return <Combo combo={c} key={c.id} ref={refs[c.idx]} />;
          })}
        </div>
        <div className="legende">
          <Legende legende={range.legende} />
        </div>
        {range.id !== -1 && (
          <button onClick={() => sauverRange()}>Sauvegarder</button>
        )}
      </div>
    );
  }
};

export default DetailRange;
