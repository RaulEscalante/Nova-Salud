import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import "./MainLayout.css";

const pageInformation = {
    "/": {
        title: "Dashboard",
        description: "Resumen general de la gestión de Nova Salud"
    },
    "/categorias": {
        title: "Categorías",
        description: "Organiza y administra las categorías de productos"
    },
    "/productos": {
        title: "Productos",
        description: "Administra el catálogo de productos de la botica"
    },
    "/inventario": {
        title: "Inventario",
        description: "Consulta y controla las existencias de productos"
    },
    "/lotes": {
        title: "Lotes y vencimientos",
        description: "Controla los lotes y las fechas de vencimiento"
    },
    "/alertas": {
        title: "Alertas",
        description: "Consulta los avisos de stock y vencimientos"
    },
    "/ventas": {
        title: "Ventas",
        description: "Registra y consulta las ventas de la botica"
    }
};

const MainLayout = () => {
    const location = useLocation();

    const currentPage = pageInformation[location.pathname] || {
        title: "Nova Salud",
        description: "Sistema de gestión de botica"
    };

    return (
        <div className="main-layout">
            <Sidebar />

            <div className="main-content">
                <Header
                    title={currentPage.title}
                    description={currentPage.description}
                />

                <main className="main-page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;