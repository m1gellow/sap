// components/CartInfo.tsx (новый файл)
import { useCart } from '../../lib/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../lib/context/SettingsContext';
import { formatPrice } from '../../lib/utils/currency';

export const CartInfo = () => {
    const { totalPrice } = useCart();
      const { settings } = useSettings();
      const currency = settings?.general?.currency || 'RUB';
      const priceInMainUnit = (totalPrice ?? 0) / 100;
      const formattedPrice = formatPrice(priceInMainUnit, currency);

    return (
        <Link to={'/cart'}>
            <div className="gap-2 flex items-center">
                <ShoppingBag className="text-text-primary" />
                {totalPrice > 0 && (
                    <span className="bg-blue text-white px-2 py-1 text-xs font-light rounded-md">
                        {formattedPrice}
                    </span>
                )}
            </div>
        </Link>
    );
}