// CartContext.js

import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  const addToCart = (event) => {
    dispatch({ type: 'ADD_TO_CART', payload: event });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
