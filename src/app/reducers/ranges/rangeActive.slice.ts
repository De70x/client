import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {CouleurType} from "../../domain/couleur";
import {CouleurToComboType} from "../../domain/couleurToCombo";
import {RangeType} from "../../domain/range";

export interface RangeActiveState {
    loading: boolean;
    errors: boolean;
    rangeActive: RangeType;
    couleurActive: CouleurType;
    sauvegarde: boolean;
}

const rangeParDefaut: RangeType = {
    id: -1,
    libelle: "Aucune Range Sélectionnée",
    combos: [],
    legende: {id: -1, libelle: "", couleurs: []},
};

const couleurParDefaut: CouleurType = {
    id: -1,
    libelle: "Open",
    valeur: "#00FF00",
    legendeId: -1,
};

export const initialState: RangeActiveState = {
    loading: true,
    errors: false,
    rangeActive: rangeParDefaut,
    couleurActive: couleurParDefaut,
    sauvegarde: true,
};

const rangeActiveSlice = createSlice({
    name: "rangeActive",
    initialState,
    reducers: {
        setRangeActive: (state, {payload}) => {
            state.sauvegarde = true;
            state.rangeActive = payload;
            state.loading = false;
            state.couleurActive = payload.legende.couleurs[0];
        },
        setCouleurActive: (state, {payload}) => {
            state.couleurActive = payload;
        },
        saveRange: (state) => {
            state.loading = true;
        },
        saveRangeSuccess: (state, {payload}) => {
            state.rangeActive = payload;
            state.loading = false;
            state.sauvegarde = true;
        },
        updateCouleur: (state, {payload}) => {
            state.sauvegarde = false;
            state.rangeActive.legende.couleurs =
                state.rangeActive.legende.couleurs.map((c) => ({
                    ...c,
                    libelle: c.id === payload.id ? payload.libelle : c.libelle,
                    valeur: c.id === payload.id ? payload.valeur : c.valeur,
                }));
        },
        updateCouleurCombo: (state, {payload}) => {
            state.sauvegarde = false;
            state.rangeActive.combos = state.rangeActive.combos.map((c) => ({
                ...c,
                couleurs:
                    c.id === payload.comboId ? [...c.couleurs, payload] : c.couleurs,
            }));
        },
        deleteCouleurCombo: (state, {payload}) => {
            state.sauvegarde = false;
            state.rangeActive.combos = state.rangeActive.combos.map((c) => ({
                ...c,
                couleurs: c.id === payload ? [] : c.couleurs,
            }));
        },
        addColor: (state) => {
            state.loading = true;
        },
        addColorSuccess: (state, {payload}) => {
            state.loading = false;
            state.errors = false;
            state.sauvegarde = false;
            state.rangeActive.legende.couleurs = [
                ...state.rangeActive.legende.couleurs,
                payload,
            ];
        },
        deleteColor: (state) => {
            state.loading = true;
        },
        deleteColorSuccess: (state, {payload}) => {
            state.loading = false;
            state.sauvegarde = false;
            state.errors = false;
            state.rangeActive.legende.couleurs =
                state.rangeActive.legende.couleurs.filter((c) => c.id !== payload.id);

            state.rangeActive.combos.forEach((c) => {
                c.couleurs = c.couleurs.filter((coul) => coul.couleurId !== payload.id);
            });
        },
        failure: (state) => {
            state.loading = false;
            state.errors = true;
            state.sauvegarde = false;
        },
    },
});

export default rangeActiveSlice.reducer;

export const {
    setRangeActive,
    setCouleurActive,
    saveRange,
    saveRangeSuccess,
    updateCouleur,
    updateCouleurCombo,
    deleteCouleurCombo,
    addColor,
    addColorSuccess,
    deleteColor,
    deleteColorSuccess,
    failure,
} = rangeActiveSlice.actions;

export const rangeActiveSelector = (state: {
    rangeActiveReducer: RangeActiveState;
}) => state;

export function activerRange(range: RangeType) {
    return (dispatch: any) => {
        dispatch(activerRange(range));
    };
}

export function activerCouleur(couleur: CouleurType) {
    return (dispatch: any) => {
        dispatch(setCouleurActive(couleur));
    };
}

export function changerCouleur(couleur: CouleurType) {
    return (dispatch: any) => {
        dispatch(updateCouleur(couleur));
    };
}

export function changerCouleursCombo(cToC: CouleurToComboType) {
    return (dispatch: any) => {
        dispatch(updateCouleurCombo(cToC));
    };
}

export function retirerCouleursCombo(comboId: number) {
    return (dispatch: any) => {
        dispatch(deleteCouleurCombo(comboId));
    };
}

export function sauvegarderRange(range: RangeType) {
    return async (dispatch: any) => {
        dispatch(saveRange());

        try {
            const response = await axios.put(
                "http://localhost:8000/ranges/" + range.id,
                range
            );
            const data = await response.data;
            dispatch(saveRangeSuccess(data));
        } catch (error) {
            console.error(error);
            dispatch(failure());
        }
    };
}

export function nouvelleCouleur(couleur: CouleurType) {
    return async (dispatch: any) => {
        dispatch(addColor());

        try {
            const response = await axios.post(
                "http://localhost:8000/couleurs/",
                couleur
            );
            const data = await response.data;
            dispatch(addColorSuccess(data));
        } catch (error) {
            console.error(error);
            dispatch(failure());
        }
    };
}

export function supprimerCouleur(couleur: CouleurType) {
    return async (dispatch: any) => {
        dispatch(deleteColor());

        try {
            if (couleur.id !== -1) {
                // On supprime la couleur dans la range
                await axios.delete(
                    "http://localhost:8000/couleursToCombos/cascade/" + couleur.id
                );

                await axios.delete("http://localhost:8000/couleurs/" + couleur.id);
            }

            dispatch(deleteColorSuccess(couleur));
        } catch (error) {
            console.error(error);
            dispatch(failure());
        }
    };
}
