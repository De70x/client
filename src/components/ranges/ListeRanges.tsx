import { RangeType } from "../../app/domain/range";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";

import { rangeActiveSelector } from "../../app/reducers/ranges/rangeActive.slice";

import { setRangeActive } from "../../app/reducers/ranges/rangeActive.slice";

import DetailRange from "./DetailRange";

import "../../css/ranges/ListeRanges.css";

interface IRanges {
  ranges: RangeType[];
}

export const ListeRanges: React.FC<IRanges> = ({ ranges }) => {
  const dispatch = useAppDispatch();
  const { rangeActive, sauvegarde } =
    useAppSelector(rangeActiveSelector).rangeActiveReducer;

  const activerRange = (range: RangeType) => {
    if (!sauvegarde) {
      const res = window.confirm(
        `Vous n'avez pas sauvegardé la range ${rangeActive.libelle}, êtes-vous certain de vouloir continuer ? `
      );
      if (res) {
        dispatch(setRangeActive(range));
      }
    } else {
      dispatch(setRangeActive(range));
    }
  };

  return (
    <div className="maitreDetail">
      <div className="maitre">
        {ranges.map((r) => {
          const style =
            r.id === rangeActive?.id ? { backgroundColor: "red" } : {};
          return (
            <div
              style={style}
              key={r.id}
              onClick={() => {
                activerRange(r);
              }}
            >
              {r.libelle}
            </div>
          );
        })}
      </div>
      <div className="detail">
        <DetailRange range={rangeActive} />
      </div>
    </div>
  );
};
