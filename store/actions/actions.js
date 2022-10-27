export const ADD_NARACKA = 'ADD_NARACKA';
export const REMOVE_NARACKA = 'REMOVE_NARACKA';
export const SELECT_PARTNER = 'SELECT_PARTNER';
export const REMOVE_ITEM_FROM_NARACKA = 'REMOVE_ITEM_FROM_NARACKA';

export const addNaracka = (naracka) => {
  return {
    type: ADD_NARACKA,
    naracka: naracka,
  };
};

export const removeNaracka = () => {
  return {
    type: REMOVE_NARACKA
  };
};

export const selectParnter = (partner) => {
  return {
    type: SELECT_PARTNER,
    partner: partner,
  };
};

export const removeItemFromNaracka = (id) => {
  return {
    type: REMOVE_ITEM_FROM_NARACKA,
    id: id,
  };
};