import {
  ADD_NARACKA,
  REMOVE_NARACKA,
  SELECT_PARTNER,
  REMOVE_ITEM_FROM_NARACKA,
} from '../actions/actions';

const initialState = {
  naracki: [],
  partner: {},
};

const addNaracka = (state, action) => {
  let currentIndex;
  let item = action.naracka;

  const found = state.naracki.some((el, index) => {
    if (el.ime === item.ime) {
      currentIndex = index;
    }
    return el.ime === item.ime;
  });

  let updatedState;

  if (found) {
    item = { ...action.naracka, kolicina: item.kolicina };
    updatedState = [...state.naracki, (state.naracki[currentIndex] = item)];
    return {
      ...state,
      naracki: [...state.naracki],
      [state.naracki[currentIndex]]: item,
    };
  } else {
    const updatedItem = {
      ...item,
    };

    updatedState = [...state.naracki, updatedItem];

    return {
      ...state,
      naracki: updatedState,
    };
  }
};

const removeNaracka = (state, action) => {
  return {
    ...state,
    naracki: [],
  };
};

const selectPartner = (state, action) => {
  return {
    ...state,
    partner: action.partner,
  };
};

const removeItemFromNaracka = (state, action) => {
  return {
    ...state,
    naracki: state.naracki.filter((item) => item.id !== action.id),
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NARACKA:
      return addNaracka(state, action);
    case REMOVE_NARACKA:
      return removeNaracka(state, action);
    case SELECT_PARTNER:
      return selectPartner(state, action);
    case REMOVE_ITEM_FROM_NARACKA:
      return removeItemFromNaracka(state, action);
    default:
      return state;
  }
};

export default reducer;
