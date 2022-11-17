import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";

import Spinner from "../commun/Spinner";
import { ListeRanges } from "./ListeRanges";

import {
  fetchRanges,
  rangesSelector,
} from "../../app/reducers/ranges/range.slice";

const Ranges = () => {
  const dispatch = useAppDispatch();
  const { ranges, loading, errors } =
    useAppSelector(rangesSelector).rangesReducer;

  useEffect(() => {
    dispatch(fetchRanges());
  }, [dispatch]);

  if (loading) {
    return <Spinner key={"spinner"}/>;
  }
  if (errors) {
    return <p key={"erreur"}>Une erreur est survenue </p>;
  }
  if (!loading && !errors) {
    return <ListeRanges ranges={ranges} key={"listeRanges"}/>;
  }
  return null;
};

export default Ranges;
