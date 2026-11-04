
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Categories/Categories";
import Products from "./pages/Products/Products";
import Inventory from "./pages/Inventory/Inventory";

const Batches = () => <div>Contenido de Lotes</div>;
const Alerts = () => <div>Contenido de Alertas</div>;
const Sales = () => <div>Contenido de Ventas</div>;

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
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
