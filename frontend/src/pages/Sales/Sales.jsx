
import { useState } from "react";
import { createSale } from "../../services/saleService";
import { useToast } from "../../context/ToastContext";

import ProductSearch from "./components/ProductSearch";
import SalesCart from "./components/SalesCart";
import { useSales } from "../../context/SalesContext";

import "./Sales.css";

const Sales = () => {
  const { cartItems, setCartItems, clearCart } = useSales();
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();

  // Agregar un producto al carrito.
  const handleAddProduct = (product) => {
    const stock = Number(product.availableStock ?? 0)

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product.id
      );

      const currentQuantity = existingItem?.quantity || 0;

      if (currentQuantity >= stock) {
        showToast("No hay suficientes existencias disponibles.", "error");
        return currentItems;
      }

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          salePrice: Number(product.salePrice),
          quantity: 1,
          stock
        }
      ];
    });
  };

  // Modificar la cantidad de un producto.
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.productId !== productId) return item;

        if (newQuantity < 1 || newQuantity > item.stock) {
          return item;
        }

        return { ...item, quantity: newQuantity };
      })
    );
  };

  // Eliminar un producto del carrito.
  const handleRemoveProduct = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  };

  // Registrar la venta.
  const handleConfirmSale = async () => {
    if (cartItems.length === 0 || saving) return;

    try {
      setSaving(true);

      const saleData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      await createSale(saleData);
      setRefreshKey((current) => current + 1);
      clearCart();

      showToast("Venta registrada correctamente.", "success");
    } catch (error) {
      showToast(
        error.message || "No se pudo registrar la venta.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sales-page">
      <div className="sales-page-content">
        <ProductSearch
          onAddProduct={handleAddProduct}
          cartItems={cartItems}
          refreshKey={refreshKey}
        />

        <SalesCart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveProduct={handleRemoveProduct}
          onConfirmSale={handleConfirmSale}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default Sales;

