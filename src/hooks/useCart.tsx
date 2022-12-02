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
      // MY CODE
      // const { data: productExists } = (await api.get(
      //   `/products/${productId}`
      // )) as AxiosResponse<Product>;

      // if (!productExists) {
      //   toast.error("Erro na adição do produto");

      //   return;
      // }

      // if (cart.length === 0) {
      //   localStorage.setItem(
      //     "@RocketShoes:cart",
      //     JSON.stringify([{ ...productExists, amount: 1 }])
      //   );

      //   setCart(updateCartState);

      //   return;
      // }

      // const indexProductInCart = cart.findIndex(
      //   (itemCard) => itemCard.id === productExists.id
      // );

      // const { data: stock } = (await api.get(
      //   `/stock/${productId}`
      // )) as AxiosResponse<Stock>;

      // var updatedCart = [] as Product[];
      // if (indexProductInCart !== -1) {
      //   if (cart[indexProductInCart].amount < stock.amount) {
      //     updatedCart = cart.map((itemCart, index) => {
      //       if (index === indexProductInCart) {
      //         return { ...itemCart, amount: itemCart.amount + 1 };
      //       }

      //       return itemCart;
      //     });
      //   } else {
      //     toast.error("Quantidade solicitada fora de estoque");
      //     return;
      //   }
      // } else {
      //   updatedCart = [...cart, { ...productExists, amount: 1 }];
      // }

      // CORRECTION
      const updatedCart = [...cart];
      const productExists = updatedCart.find(
        (product) => product.id === productId
      );

      const stock = await api.get(`/stock/${productId}`);

      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if (productExists) {
        productExists.amount = amount;
      } else {
        const product = await api.get(`/products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1,
        };

        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
    } catch (err) {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = async (productId: number) => {
    try {
      // // const { data: productExists } = (await api.get(
      // //   `/products/${productId}`
      // // )) as AxiosResponse<Product>;

      // const productExists = cart.find(
      //   (product) => product.id === productId
      // );

      // if (!productExists) {
      //   toast.error("Erro na remoção do produto");

      //   return;
      // }

      // const updatedCart = cart.filter((cartItem) => cartItem.id !== productId);

      // setCart(updatedCart);
      // localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));

      // CORRECTION
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        (product) => product.id === productId
      );

      if (productIndex >= 0) {
        updatedCart.splice(productIndex, 1);

        setCart(updatedCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // const { data: productExists } = (await api.get(
      //   `/products/${productId}`
      // )) as AxiosResponse<Product>;

      // const productExists = cart.find((itemCart) => productId === itemCart.id);

      // if (!productExists) {
      //   toast.error("Erro na alteração de quantidade do produto");

      //   return;
      // }

      // const { data: stock } = (await api.get(
      //   `/stock/${productId}`
      // )) as AxiosResponse<Stock>;

      // if (!(amount <= stock.amount)) {
      //   toast.error("Erro na alteração de quantidade do produto");
      //   return;
      // }

      // const updatedCart = cart.map((itemCart) => {
      //   if (productId === itemCart.id) {
      //     return { ...itemCart, amount };
      //   }

      //   return itemCart;
      // });

      // localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
      // setCart(updateCartState);
      if (amount <= 0) {
        return;
      }

      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const updatedCart = [...cart];
      const productExists = updatedCart.find(
        (product) => product.id === productId
      );

      if (productExists) {
        productExists.amount = amount;

        setCart(updatedCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
      } else {
        throw Error();
      }
    } catch (err) {
      toast.error("Erro na alteração de quantidade do produto");
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
