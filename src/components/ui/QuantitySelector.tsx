import { MinusIcon, PlusIcon } from 'lucide-react';


interface QuantitySelectorProps{
    quantity: number,
    handleQuantityChange: (arg1: number, arg2: number) => void
}

const QuantitySelector = ({quantity, handleQuantityChange}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center">
      <button
        className="flex items-center justify-center p-2 bg-blue rounded-l-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        aria-label="Уменьшить количество"
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={quantity <= 1}
      >
        <MinusIcon size={16} color="white" />
      </button>
      <div className="bg-skyblue border-2 border-blue w-8 h-8 flex items-center justify-center">{quantity}</div>
      <button
        className="flex items-center justify-center p-2 bg-blue rounded-r-lg hover:opacity-90 transition-opacity"
        aria-label="Увеличить количество"
        onClick={() => handleQuantityChange(quantity + 1)}
      >
        <PlusIcon size={16} color="white" />
      </button>
    </div>
  );
};

export default QuantitySelector;
