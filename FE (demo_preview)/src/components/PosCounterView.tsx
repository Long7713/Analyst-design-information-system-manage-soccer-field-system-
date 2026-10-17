import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CircleCheck,
  Wallet,
} from 'lucide-react';
import { type PosProduct } from '../data/demoData';
import { type PitchBooking, formatVND } from '../utils/sanbonglonLogic';

interface PosCounterViewProps {
  products: PosProduct[];
  activeBookings: PitchBooking[];
  onCompletePosOrder: (payload: {
    targetBookingId: string | 'walk-in';
    paymentMethod: 'Tiền mặt' | 'Chuyển khoản QR';
    items: { product: PosProduct; qty: number }[];
  }) => void;
}

export const PosCounterView: React.FC<PosCounterViewProps> = ({
  products,
  activeBookings,
  onCompletePosOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetBookingId, setTargetBookingId] = useState<string>('SBL-24102');
  const [paymentMethod, setPaymentMethod] = useState<'Tiền mặt' | 'Chuyển khoản QR'>('Chuyển khoản QR');
  const [cart, setCart] = useState<{ product: PosProduct; qty: number }[]>([
    { product: products[0], qty: 6 },
    { product: products[1], qty: 4 },
  ]);

  const categories = ['Tất cả', 'Nước giải khát', 'Thuê & Phụ kiện', 'Dịch vụ sân', 'Đồ ăn nhẹ'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'Tất cả' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product: PosProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Dịch Vụ & POS Bán Hàng Tại Quầy</h1>
          <p className="sbl-page-subtitle">
            Xuất nhanh nước giải khát ướp lạnh, thuê áo Bib và trọng tài trực tiếp vào sân đang hoạt động hoặc thu tiền khách lẻ tại quầy.
          </p>
        </div>
      </div>

      <div className="sbl-pos-layout">
        {/* Left: Product Catalog */}
        <div className="sbl-panel">
          <div className="sbl-table-toolbar">
            <div className="sbl-segmented" role="group" aria-label="Danh mục sản phẩm POS">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`sbl-segment-btn ${selectedCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="form-search-wrapper" style={{ minWidth: '220px' }}>
              <Search size={16} className="form-search-icon" />
              <input
                type="search"
                className="form-input form-search-input"
                placeholder="Tìm tên nước, phụ kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Tìm kiếm hàng POS"
              />
            </div>
          </div>

          <div className="sbl-panel-body">
            <div className="sbl-pos-catalog-grid">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                return (
                  <button
                    key={product.id}
                    type="button"
                    className="sbl-pos-product-card"
                    onClick={() => addToCart(product)}
                    aria-label={`Thêm ${product.name} giá ${formatVND(product.price)}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-mono-tech truncate">{product.sku}</span>
                        <span
                          className="font-mono-tech shrink-0"
                          style={{ color: isLowStock ? 'var(--status-warning-text)' : 'var(--text-secondary)' }}
                        >
                          Tồn: {product.stock}
                        </span>
                      </div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {product.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {product.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t w-full" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="font-mono-tech font-bold text-sm">{formatVND(product.price)}</span>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{ color: 'var(--status-success-text)' }}
                      >
                        <Plus size={14} strokeWidth={2.2} />
                        <span>Chọn</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active POS Order Cart */}
        <div className="sbl-panel">
          <div className="sbl-panel-header">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} strokeWidth={1.8} />
              <h2 className="sbl-panel-title">Phiếu Order Hiện Tại ({cartItemCount})</h2>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setCart([])}
              >
                Xóa giỏ
              </button>
            )}
          </div>

          <div className="sbl-panel-body flex flex-col gap-4">
            {/* Target Pitch or Walk-in Selector */}
            <div className="form-group">
              <label htmlFor="posTargetSelect" className="form-label">
                Gắn vào sân đang hoạt động / Khách lẻ:
              </label>
              <select
                id="posTargetSelect"
                className="form-select font-medium"
                value={targetBookingId}
                onChange={(e) => setTargetBookingId(e.target.value)}
              >
                <option value="walk-in">Khách mua lẻ trực tiếp tại quầy</option>
                {activeBookings
                  .filter((b) => b.status === 'checked-in' || b.status === 'confirmed')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.pitchId} — {b.teamName} ({b.id})
                    </option>
                  ))}
              </select>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div
                className="py-8 text-center rounded border border-dashed text-xs"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
              >
                Chưa có món nào trong phiếu bán hàng. Nhấn vào các món bên trái để thêm nhanh.
              </div>
            ) : (
              <div className="flex flex-col divide-y border rounded" style={{ borderColor: 'var(--border-color)' }}>
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs truncate">{item.product.name}</div>
                      <div className="font-mono-tech text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {formatVND(item.product.price)} / {item.product.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon btn-sm"
                        style={{ width: 26, height: 26 }}
                        onClick={() => updateCartQty(item.product.id, -1)}
                        aria-label={`Giảm số lượng ${item.product.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="font-mono-tech text-xs font-bold w-6 text-center">{item.qty}</span>
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon btn-sm"
                        style={{ width: 26, height: 26 }}
                        onClick={() => updateCartQty(item.product.id, 1)}
                        aria-label={`Tăng số lượng ${item.product.name}`}
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ width: 26, height: 26, color: 'var(--status-danger-text)' }}
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Xóa ${item.product.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="form-group">
              <span className="form-label">Phương thức thanh toán:</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Chuyển khoản QR', 'Tiền mặt'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`btn btn-sm ${paymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <Wallet size={14} />
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary & Submit */}
            <div
              className="p-4 rounded border flex flex-col gap-2"
              style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-strong)' }}
            >
              <div className="flex items-center justify-between text-xs">
                <span>Tổng số lượng:</span>
                <span className="font-mono-tech font-semibold">{cartItemCount} món</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <span>Tổng thanh toán POS:</span>
                <span className="font-mono-tech">{formatVND(cartTotal)}</span>
              </div>
              <button
                type="button"
                className="btn btn-lime w-full mt-2"
                disabled={cart.length === 0}
                onClick={() => {
                  onCompletePosOrder({
                    targetBookingId,
                    paymentMethod,
                    items: cart,
                  });
                  setCart([]);
                }}
              >
                <CircleCheck size={17} strokeWidth={2} />
                <span>
                  {targetBookingId === 'walk-in'
                    ? 'Thu tiền & Xuất biên lai quầy'
                    : `Ghi vào phiếu ${targetBookingId} & Xuất kho`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
