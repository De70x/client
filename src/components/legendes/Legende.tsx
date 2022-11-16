import {LegendeType} from "../../app/domain/legende";
import {useAppDispatch} from "../../app/hooks/hooks";

import {nouvelleCouleur} from "../../app/reducers/ranges/rangeActive.slice";

import "../../css/legendes/Legende.css";
import Couleur from "../couleurs/Couleur";

interface ILegende {
    legende: LegendeType;
}

const Legende: React.FC<ILegende> = ({legende}) => {
    const dispatch = useAppDispatch();

    const ajouterCouleur = () => {
        dispatch(nouvelleCouleur({
            id: -1,
            libelle: "Open",
            valeur: "#00FF00",
            legendeId: legende.id,
        }));
    };

    return (
        <div className="listeCouleurs">
            <h4>{legende.libelle}</h4>
            {legende.couleurs.map((c) => {
                return <Couleur couleur={c} key={c.id}/>;
            })}
            {legende.id !== -1 && <button onClick={ajouterCouleur}>Ajouter</button>}
        </div>
    );
};

export default Legende;
