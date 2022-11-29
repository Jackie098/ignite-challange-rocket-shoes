import { AxiosResponse } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

function updateCartState(): Product[] {
  const storagedCart = localStorage.getItem("@RocketShoes:cart");

  if (storagedCart) {
    return JSON.parse(storagedCart);
  }

  return [] as Product[];
}

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data: productExists } = (await api.get(
        `/products/${productId}`
      )) as AxiosResponse<Product>;

      if (!productExists) {
        toast.error("Erro na adição do produto");

        return;
      }

      if (cart.length === 0) {
        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify([{ ...productExists, amount: 1 }])
        );

        setCart(updateCartState);

        return;
      }

      const indexProductInCart = cart.findIndex(
        (itemCard) => itemCard.id === productExists.id
      );

      const { data: stock } = (await api.get(
        `/stock/${productId}`
      )) as AxiosResponse<Stock>;

      var updatedCart = [] as Product[];
      if (indexProductInCart !== -1) {
        if (cart[indexProductInCart].amount < stock.amount) {
          updatedCart = cart.map((itemCart, index) => {
            if (index === indexProductInCart) {
              return { ...itemCart, amount: itemCart.amount + 1 };
            }

            return itemCart;
          });
        } else {
          toast.error("Quantidade solicitada fora de estoque");
          return;
        }
      } else {
        updatedCart = [...cart, { ...productExists, amount: 1 }];
      }

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
      setCart(updateCartState);
    } catch (err) {
      console.log(err);
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
