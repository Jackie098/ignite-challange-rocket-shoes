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

      // const { data: stock } = await api.get(`/stock/${productId}`);

      // if (stock === 0) {
      //   toast.error("Quantidade solicitada fora de estoque");
      //   return;
      // }

      const storagedCartBeforeConvert =
        localStorage.getItem("@RocketShoes:cart");

      console.log("storagedCartBeforeConvert", storagedCartBeforeConvert);

      const storagedCart: Product[] = storagedCartBeforeConvert
        ? JSON.parse(storagedCartBeforeConvert)
        : [];

      if (storagedCart.length === 0) {
        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify([{ ...productExists, amount: 1 }])
        );

        return;
      }

      console.log("storagedCart", storagedCart);
      console.log(
        "localStorage: cart",
        localStorage.getItem("@RocketShoes:cart")
      );

      const updatedCart: Product[] = storagedCart.map((product) => {
        const [productAlreadyCart] = storagedCart.filter(
          () => product.id === productExists.id
        );

        console.log("product", product);
        console.log("productAlreadyCart", productAlreadyCart);

        // if (!productAlreadyCart) {
        //   return productExists;
        // } else
        if (productAlreadyCart) {
          return {
            ...productAlreadyCart,
            amount: productAlreadyCart.amount + 1,
          };
        }

        return product;

        // } else {
        //   return product;
        // }
      });

      console.log("updatedCart", updatedCart);

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
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
