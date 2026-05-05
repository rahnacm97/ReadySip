import React from "react";
import type { Product, CartItem } from "../../types";

interface Props {
  product: Product;
  cartItem?: CartItem;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
}

const drinkIcon: Record<string, string> = {
  tea: "🍵",
  coffee: "☕",
  juice: "🥤",
};

const ProductCard: React.FC<Props> = ({
  product,
  cartItem,
  onAdd,
  onRemove,
}) => {
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-brand-500 transition-all duration-300 animate-fade-in group bg-white shadow-xl shadow-stone-200/50">
      {/* Image / Icon */}
      <div className="relative h-44 rounded-xl overflow-hidden bg-brand-50 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl">{drinkIcon[product.type] ?? "🥤"}</span>
        )}
        <span className="absolute top-2 right-2 bg-brand-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
          {product.type}
        </span>
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-warm-400 text-sm font-black uppercase tracking-tighter">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-display text-lg font-bold text-warm-500 leading-tight group-hover:text-brand-500 transition-colors">
          {product.title}
        </h3>

        {/* Rating stars */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex text-xs">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={
                  s <= Math.round(product.averageRating || 0)
                    ? "text-amber-400"
                    : "text-stone-200"
                }
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-[10px] font-bold text-warm-300 uppercase tracking-tighter">
            ({product.numReviews || 0})
          </span>
        </div>

        <p className="text-warm-400 text-sm mt-1 line-clamp-2 font-medium">
          {product.description}
        </p>
      </div>

      {/* Price + Cart Controls */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
        <span className="text-brand-500 font-black text-xl">
          ₹{product.price}
        </span>
        {product.isAvailable &&
          (qty === 0 ? (
            <button
              id={`add-${product._id}`}
              onClick={() => onAdd(product)}
              className="btn-primary text-xs px-5 py-2.5 shadow-brand-500/10"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                id={`remove-${product._id}`}
                onClick={() => onRemove(product._id)}
                className="w-9 h-9 rounded-xl bg-warm-100 hover:bg-brand-500 text-warm-500 hover:text-white font-black transition-all shadow-sm flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center font-black text-warm-500">
                {qty}
              </span>
              <button
                id={`add-more-${product._id}`}
                onClick={() => onAdd(product)}
                className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black transition-all shadow-md flex items-center justify-center"
              >
                +
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductCard;
