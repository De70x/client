import {RangeType} from "../../app/domain/range";
import {useAppDispatch, useAppSelector} from "../../app/hooks/hooks";

import {rangeActiveSelector, setRangeActive} from "../../app/reducers/ranges/rangeActive.slice";

import DetailRange from "./DetailRange";

import "../../css/ranges/ListeRanges.css";
import {creerRange, fetchRanges} from "../../app/reducers/ranges/range.slice";
import {useEffect} from "react";

interface IRanges {
    ranges: RangeType[];
}

export const ListeRanges: React.FC<IRanges> = ({ranges}) => {
    const dispatch = useAppDispatch();
    const {rangeActive, sauvegarde} =
        useAppSelector(rangeActiveSelector).rangeActiveReducer;

    useEffect(() => {
        return () => {
            dispatch(fetchRanges());
        };
    }, []);


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

    const handleCreerRange = () => {
        const range: RangeType = {
            range_id: -1,
            libelle: "Nouvelle range",
            combos: [],
            actions: []
        };
        dispatch(creerRange(range))
        setRangeActive(range);
    }

    return (
        <div className="maitreDetail">
            <div className="maitre" key={"maitre"}>
                {ranges.map((r) => {
                    const style =
                        r.range_id === rangeActive?.range_id ? {backgroundColor: "red"} : {};
                    return (
                        <div
                            style={style}
                            key={r.range_id}
                            onClick={() => {
                                activerRange(r);
                            }}
                        >
                            {r.libelle}
                        </div>
                    );
                })}
                <button onClick={handleCreerRange} key={"btn"}>Créer range</button>
            </div>
            <div className="detail" key={"detail"}>
                <DetailRange range={rangeActive}/>
            </div>
        </div>
    );
};
