
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Categories/Categories";
import Products from "./pages/Products/Products";
import Inventory from "./pages/Inventory/Inventory";
import Purchases from "./pages/Purchases/Purchases";
import Batches from "./pages/Batches/Batches";
import Alerts from "./pages/Alerts/Alerts";
import Sales from "./pages/Sales/Sales";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/lotes" element={<Batches />} />
            <Route path="/alertas" element={<Alerts />} />
            <Route path="/ventas" element={<Sales />} />
            <Route path="/compras" element={<Purchases />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
