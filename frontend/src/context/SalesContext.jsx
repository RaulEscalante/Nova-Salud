
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const SalesContext = createContext(null);

const STORAGE_KEY = "nova_salud_sales_cart";

// Obtener carrito guardado
const getInitialCart = () => {
    try {
        const savedCart = sessionStorage.getItem(STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch {
        return [];
    }
};

export const SalesProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getInitialCart);

    // Persistir carrito cuando cambie
    useEffect(() => {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    // Limpiar carrito
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <SalesContext.Provider
            value={{
                cartItems,
                setCartItems,
                clearCart
            }}
        >
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SalesContext);

    if (!context) {
        throw new Error(
            "useSales debe utilizarse dentro de SalesProvider"
        );
    }

    return context;
};
