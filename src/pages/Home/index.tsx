import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  // const { addProduct, cart } = useCart();
  const [products, setProducts] = useState<ProductFormatted[]>([]);

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   // TODO
  // }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response: any = await api.get("/products");

        setProducts(
          response.data.map((product: Product) => {
            return { ...product, priceFormatted: formatPrice(product.price) };
          })
        );
      } catch (err) {
        console.log("err", err);
      }
    }

    loadProducts();
  }, []);

  console.log(products);

  function handleAddProduct(id: number) {
    // TODO
  }

  return (
    <ProductList>
        <button
          type="button"
          data-testid="add-product-button"
        // onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {/* {cartItemsAmount[product.id] || 0} */} 2
          </div>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
      ))}
    </ProductList>
  );
};

export default Home;
