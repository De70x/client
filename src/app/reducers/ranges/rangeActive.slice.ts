import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {RangeType} from "../../domain/range";
import {ActionType} from "../../domain/action";
import {ComboActionType} from "../../domain/comboAction";

export interface RangeActiveState {
    loading: boolean;
    errors: boolean;
    rangeActive: RangeType;
    actionActive: ActionType;
    sauvegarde: boolean;
}

const rangeParDefaut: RangeType = {
    id: -1,
    libelle: "Aucune Range Sélectionnée",
    combos: [],
    actions: []
};

const actionParDefaut: ActionType = {
    action_id: -1,
    libelle: "Open",
    couleur: "00FF00",
    range_id: -1,
};

export const initialState: RangeActiveState = {
    loading: true,
    errors: false,
    rangeActive: rangeParDefaut,
    actionActive: actionParDefaut,
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
            state.actionActive = payload.actions[0];
        },
        setCouleurActive: (state, {payload}) => {
            state.actionActive = payload;
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
            state.rangeActive.actions =
                state.rangeActive.actions.map((a) => ({
                    ...a,
                    libelle: a.action_id === payload.id ? payload.libelle : a.libelle,
                    valeur: a.action_id === payload.id ? payload.couleur : a.couleur,
                }));
        },
        updateCouleurCombo: (state, {payload}) => {
            state.sauvegarde = false;
            state.rangeActive.combos = state.rangeActive.combos.map((c) => ({
                ...c,
                actions:
                    c.id === payload.comboId ? [...c.actions, payload] : c.actions,
            }));
        },
        deleteCouleurCombo: (state, {payload}) => {
            state.sauvegarde = false;
            state.rangeActive.combos = state.rangeActive.combos.map((c) => ({
                ...c,
                actions: c.id === payload ? [] : c.actions,
            }));
        },
        addColor: (state) => {
            state.loading = true;
        },
        addColorSuccess: (state, {payload}) => {
            state.loading = false;
            state.errors = false;
            state.sauvegarde = false;
            state.rangeActive.actions = [
                ...state.rangeActive.actions,
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
            state.rangeActive.actions =
                state.rangeActive.actions.filter((a) => a.action_id !== payload.id);

            state.rangeActive.combos.forEach((c) => {
                c.actions = c.actions.filter((coul) => coul.action_id !== payload.id);
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

export function activerCouleur(couleur: ActionType) {
    return (dispatch: any) => {
        dispatch(setCouleurActive(couleur));
    };
}

export function changerCouleur(couleur: ActionType) {
    return (dispatch: any) => {
        dispatch(updateCouleur(couleur));
    };
}

export function changerCouleursCombo(cToC: ComboActionType) {
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
                "http://localhost:5000/api/ranges/" + range.id,
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

export function nouvelleCouleur(couleur: ActionType) {
    return async (dispatch: any) => {
        dispatch(addColor());

        try {
            const response = await axios.post(
                "http://localhost:5000/api/action/",
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

export function supprimerCouleur(couleur: ActionType) {
    return async (dispatch: any) => {
        dispatch(deleteColor());

        try {
            if (couleur.action_id !== -1) {
                // On supprime la couleur dans la range
                await axios.delete(
                    "http://localhost:5000/api/couleursToCombos/cascade/" + couleur.action_id
                );

                await axios.delete("http://localhost:5000/api/couleurs/" + couleur.action_id);
            }

            dispatch(deleteColorSuccess(couleur));
        } catch (error) {
            console.error(error);
            dispatch(failure());
        }
    };
}
