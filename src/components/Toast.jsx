import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && <div className="toast card">{toast}</div>}
    </div>
  );
}
