// components/CartInfo.tsx (новый файл)
import { useCart } from '../../lib/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartInfo = () => {
    const { totalPrice } = useCart(); // Только этот компонент зависит от корзины

    return (
        <Link to={'/cart'}>
            <div className="gap-2 flex items-center">
                <ShoppingBag className="text-text-primary" />
                {totalPrice > 0 && (
                    <span className="bg-blue text-white px-2 py-1 text-xs font-light rounded-md">
                        {totalPrice} р.
                    </span>
                )}
            </div>
        </Link>
    );
}