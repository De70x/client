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
    return <Spinner />;
  }
  if (errors) {
    return <>Une erreur est survenue </>;
  }
  if (!loading && !errors) {
    return <ListeRanges ranges={ranges} />;
  }
  return null;
};

export default Ranges;
