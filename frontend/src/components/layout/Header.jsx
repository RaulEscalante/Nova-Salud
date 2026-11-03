import { Bell, Search, UserCircle } from "lucide-react";
import "./Header.css";

const Header = ({ title, description }) => {
    return (
        <header className="main-header">
            <div className="header-heading">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>

            <div className="header-actions">
                <button className="header-icon-button" title="Buscar">
                    <Search size={19} />
                </button>

                <button className="header-icon-button" title="Notificaciones">
                    <Bell size={19} />
                    <span className="notification-indicator"></span>
                </button>

                <div className="header-divider"></div>

                <div className="header-user">
                    <div className="header-user-avatar">
                        <UserCircle size={22} />
                    </div>

                    <div className="header-user-info">
                        <span className="header-user-name">Administrador</span>
                        <span className="header-user-role">Gestión de botica</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;