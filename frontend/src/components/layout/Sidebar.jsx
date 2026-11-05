import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tags,
  Package,
  Boxes,
  CalendarClock,
  Bell,
  ShoppingCart,
  Cross,
  ChevronLeft
} from "lucide-react";

import "./Sidebar.css";


const menuItems = [
  {
    title: "PRINCIPAL",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard
      }
    ]
  },
  {
    title: "GESTIÓN DE PRODUCTOS",
    items: [
      {
        name: "Productos",
        path: "/productos",
        icon: Package
      },
      {
        name: "Categorías",
        path: "/categorias",
        icon: Tags
      },
      {
        name: "Compras a proveedores",
        path: "/compras",
        icon: ShoppingCart
      }
    ]
  },
  {
    title: "CONTROL DE INVENTARIO",
    items: [
      {
        name: "Inventario",
        path: "/inventario",
        icon: Boxes
      },
      {
        name: "Lotes y vencimientos",
        path: "/lotes",
        icon: CalendarClock
      },
      {
        name: "Alertas",
        path: "/alertas",
        icon: Bell
      }
    ]
  },
  {
    title: "VENTAS",
    items: [
      {
        name: "Registrar venta",
        path: "/ventas",
        icon: ShoppingCart
      },
      {
        name: "Historial de ventas",
        path: "/ventas/historial",
        icon: CalendarClock
      }
    ]
  }
];


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Cross size={25} strokeWidth={2.5} />
        </div>

        <div className="sidebar-brand-text">
          <h2>Nova Salud</h2>
          <span>Gestión de botica</span>
        </div>
      </div>

      <nav className="sidebar-navigation">
        {menuItems.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <span className="sidebar-section-title">
              {section.title}
            </span>

            <div className="sidebar-menu">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Sistema de inventario</span>
        <span>Nova Salud © 2026</span>
      </div>
    </aside>
  );
};

export default Sidebar;