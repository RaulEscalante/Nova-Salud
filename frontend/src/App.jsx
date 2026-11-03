import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";

const Categories = () => <div>Contenido de Categorías</div>;
const Products = () => <div>Contenido de Productos</div>;
const Inventory = () => <div>Contenido de Inventario</div>;
const Batches = () => <div>Contenido de Lotes</div>;
const Alerts = () => <div>Contenido de Alertas</div>;
const Sales = () => <div>Contenido de Ventas</div>;


function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;