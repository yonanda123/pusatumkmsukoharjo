"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  unit: string;
  image: string;
  badge?: string;
}

interface CartItem extends Product {
  qty: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Paving Hexagonal Eco",
    desc: "Paving berbahan kertas daur ulang, kuat & ramah lingkungan. Cocok untuk taman dan jalan setapak.",
    price: 85000,
    unit: "m²",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Paving Persegi Green",
    desc: "Desain modern berbentuk persegi, tahan cuaca dan tekanan. Ideal untuk halaman rumah.",
    price: 72000,
    unit: "m²",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
  },
  {
    id: 3,
    name: "Paving Natural Stone",
    desc: "Tampilan natural batu alam dari bahan kertas press. Estetik dan berkelanjutan.",
    price: 98000,
    unit: "m²",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80",
    badge: "Baru",
  },
  {
    id: 4,
    name: "Paving Interlocking Pro",
    desc: "Sistem interlocking yang mudah dipasang sendiri, berbahan komposit kertas & semen eco.",
    price: 110000,
    unit: "m²",
    image: "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80",
  },
  {
    id: 5,
    name: "Paving Mini Garden",
    desc: "Ukuran kompak untuk taman kecil, balkon, dan lorong. Ringan dan mudah dipotong.",
    price: 65000,
    unit: "m²",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  },
  {
    id: 6,
    name: "Paving Artistik Batik",
    desc: "Motif batik khas Sukoharjo, dibuat dari kertas limbah lokal. Seni dan fungsi dalam satu.",
    price: 125000,
    unit: "m²",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
    badge: "Eksklusif",
  },
];

const RUPIAH = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payStep, setPayStep] = useState<"form" | "confirm" | "success">("form");
  const [form, setForm] = useState({ name: "", phone: "", address: "", method: "transfer" });
  const [addedId, setAddedId] = useState<number | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  // Close cart on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === p.id);
      if (exists) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
    setCartOpen(true);
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setPayStep("form");
    setPayOpen(true);
  };

  const handlePay = () => {
    if (!form.name || !form.phone || !form.address) return alert("Lengkapi semua data!");
    setPayStep("confirm");
  };

  const handleConfirm = () => {
    setPayStep("success");
    setCart([]);
  };

  const closeModal = () => {
    setPayOpen(false);
    setPayStep("form");
    setForm({ name: "", phone: "", address: "", method: "transfer" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green-900: #0f2e1a;
          --green-800: #1a4427;
          --green-700: #1f5c32;
          --green-600: #276b3c;
          --green-500: #2d8b50;
          --green-400: #41b566;
          --green-300: #6ecf8e;
          --green-100: #d4f0dd;
          --green-50:  #f0fbf4;
          --sand:      #f5f0e8;
          --sand-dark: #e8e0d0;
          --brown:     #7c5c3a;
          --text:      #1a2418;
          --text-muted:#4a5a46;
          --white:     #ffffff;
          --shadow-sm: 0 2px 8px rgba(15,46,26,.08);
          --shadow-md: 0 8px 32px rgba(15,46,26,.14);
          --shadow-lg: 0 20px 60px rgba(15,46,26,.2);
          --radius:    14px;
          --radius-sm: 8px;
        }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--sand);
          color: var(--text);
          min-height: 100vh;
        }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(41,107,60,.12);
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 68px;
        }
        .nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--green-900);
        }
        .nav-logo {
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg, var(--green-700), var(--green-400));
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .nav-title {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem; font-weight: 700; line-height: 1.1;
          color: var(--green-900);
        }
        .nav-sub { font-size: .65rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }
        .nav-links { display: flex; gap: 28px; align-items: center; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: .875rem; font-weight: 600; transition: color .2s; }
        .nav-links a:hover { color: var(--green-600); }
        .nav-right { display: flex; align-items: center; gap: 16px; }

        /* ── CART BUTTON ── */
        .cart-btn {
          position: relative; cursor: pointer;
          background: var(--green-800); color: #fff;
          border: none; border-radius: 50px;
          padding: 10px 18px; display: flex; align-items: center; gap: 8px;
          font-family: inherit; font-size: .875rem; font-weight: 700;
          transition: background .2s, transform .15s;
        }
        .cart-btn:hover { background: var(--green-700); transform: translateY(-1px); }
        .cart-badge {
          position: absolute; top: -6px; right: -6px;
          background: #e84040; color: #fff; font-size: .7rem; font-weight: 800;
          min-width: 20px; height: 20px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; padding: 0 4px;
          border: 2px solid #fff;
          animation: pop .25s ease;
        }
        @keyframes pop { 0%{ transform:scale(.5) } 70%{ transform:scale(1.25) } 100%{ transform:scale(1) } }

        /* ── CART DROPDOWN ── */
        .cart-wrap { position: relative; }
        .cart-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          width: 360px;
          background: #fff; border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(41,107,60,.1);
          overflow: hidden;
          animation: slideDown .2s ease;
          z-index: 200;
        }
        @keyframes slideDown { from{ opacity:0; transform:translateY(-10px) } to{ opacity:1; transform:none } }
        .cart-head {
          padding: 16px 20px; font-weight: 800; font-size: .95rem;
          border-bottom: 1px solid var(--sand-dark);
          display: flex; align-items: center; justify-content: space-between;
          background: var(--green-50);
        }
        .cart-items { max-height: 300px; overflow-y: auto; padding: 8px 0; }
        .cart-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 20px; transition: background .15s;
        }
        .cart-item:hover { background: var(--green-50); }
        .cart-item-img {
          width: 48px; height: 48px; border-radius: 8px; object-fit: cover; flex-shrink: 0;
        }
        .cart-item-name { font-weight: 700; font-size: .82rem; line-height: 1.3; }
        .cart-item-price { font-size: .78rem; color: var(--green-600); font-weight: 600; margin-top: 2px; }
        .cart-item-info { flex: 1; min-width: 0; }
        .qty-ctrl { display: flex; align-items: center; gap: 6px; }
        .qty-btn {
          width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid var(--sand-dark);
          background: #fff; cursor: pointer; font-size: 1rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          color: var(--green-800); transition: all .15s;
        }
        .qty-btn:hover { background: var(--green-100); border-color: var(--green-300); }
        .qty-num { font-size: .82rem; font-weight: 700; min-width: 18px; text-align: center; }
        .cart-empty { padding: 36px 20px; text-align: center; color: var(--text-muted); font-size: .875rem; }
        .cart-foot { padding: 16px 20px; border-top: 1px solid var(--sand-dark); background: var(--green-50); }
        .cart-total { display: flex; justify-content: space-between; font-weight: 800; font-size: .95rem; margin-bottom: 12px; }
        .btn-checkout {
          width: 100%; padding: 12px; border: none; border-radius: var(--radius-sm);
          background: linear-gradient(135deg, var(--green-700), var(--green-500));
          color: #fff; font-family: inherit; font-size: .9rem; font-weight: 800;
          cursor: pointer; transition: opacity .2s, transform .15s;
        }
        .btn-checkout:hover { opacity: .92; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          background: linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 60%, var(--green-500) 100%);
          color: #fff; padding: 80px 24px;
          display: flex; align-items: center; justify-content: center;
          text-align: center; position: relative; overflow: hidden;
          min-height: 440px;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpolygon points='30 0 60 15 60 45 30 60 0 45 0 15'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-content { position: relative; max-width: 680px; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
          border-radius: 50px; padding: 6px 16px; font-size: .78rem; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase; margin-bottom: 20px;
        }
        .hero h1 {
          font-family: 'Fraunces', serif; font-size: clamp(2.2rem,5vw,3.4rem);
          font-weight: 700; line-height: 1.15; margin-bottom: 16px;
        }
        .hero h1 em { font-style: italic; color: var(--green-300); }
        .hero-desc { font-size: 1rem; opacity: .85; max-width: 500px; margin: 0 auto 32px; line-height: 1.65; }
        .hero-stats { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 700; }
        .stat-label { font-size: .75rem; opacity: .7; margin-top: 2px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }

        /* ── SECTION ── */
        .section { max-width: 1200px; margin: 0 auto; padding: 64px 24px; }
        .section-header { margin-bottom: 40px; }
        .section-title { font-family: 'Fraunces', serif; font-size: clamp(1.6rem,3vw,2.2rem); font-weight: 700; color: var(--green-900); }
        .section-sub { color: var(--text-muted); font-size: .9rem; margin-top: 8px; font-weight: 500; }

        /* ── GRID ── */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px,1fr));
          gap: 24px;
        }

        /* ── CARD ── */
        .card {
          background: #fff; border-radius: var(--radius);
          box-shadow: var(--shadow-sm); overflow: hidden;
          display: flex; flex-direction: column;
          transition: box-shadow .25s, transform .25s;
          border: 1px solid rgba(41,107,60,.07);
        }
        .card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
        .card-img-wrap { position: relative; height: 210px; overflow: hidden; }
        .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
        .card:hover .card-img { transform: scale(1.05); }
        .card-badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--green-700); color: #fff;
          font-size: .7rem; font-weight: 800; letter-spacing: .04em;
          padding: 4px 10px; border-radius: 50px; text-transform: uppercase;
        }
        .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .card-name { font-weight: 800; font-size: 1rem; color: var(--green-900); margin-bottom: 6px; }
        .card-desc { font-size: .82rem; color: var(--text-muted); line-height: 1.6; flex: 1; margin-bottom: 16px; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .card-price { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 700; color: var(--green-700); }
        .card-unit { font-size: .72rem; color: var(--text-muted); margin-top: 1px; font-weight: 600; }
        .btn-add {
          background: var(--green-800); color: #fff;
          border: none; border-radius: var(--radius-sm);
          padding: 10px 18px; font-family: inherit; font-size: .82rem; font-weight: 800;
          cursor: pointer; transition: all .2s; white-space: nowrap;
          display: flex; align-items: center; gap: 6px;
        }
        .btn-add:hover { background: var(--green-600); transform: translateY(-1px); }
        .btn-add.added { background: var(--green-400); }

        /* ── WHY ── */
        .why-section { background: var(--green-900); color: #fff; }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 24px; }
        .why-card {
          background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
          border-radius: var(--radius); padding: 28px 24px;
          transition: background .2s;
        }
        .why-card:hover { background: rgba(255,255,255,.12); }
        .why-icon { font-size: 2rem; margin-bottom: 14px; }
        .why-title { font-weight: 800; font-size: .95rem; margin-bottom: 8px; }
        .why-desc { font-size: .8rem; opacity: .7; line-height: 1.65; }

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(10,25,15,.55); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadeIn .2s ease;
        }
        @keyframes fadeIn { from{ opacity:0 } to{ opacity:1 } }
        .modal {
          background: #fff; border-radius: 20px; width: 100%; max-width: 500px;
          box-shadow: var(--shadow-lg); overflow: hidden;
          animation: slideUp .25s ease;
          max-height: 90vh; overflow-y: auto;
        }
        @keyframes slideUp { from{ opacity:0; transform:translateY(30px) } to{ opacity:1; transform:none } }
        .modal-head {
          background: linear-gradient(135deg, var(--green-900), var(--green-700));
          color: #fff; padding: 24px 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .modal-title { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700; }
        .modal-close {
          width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.3);
          background: transparent; color: #fff; font-size: 1.1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: background .2s;
        }
        .modal-close:hover { background: rgba(255,255,255,.15); }
        .modal-body { padding: 28px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: .8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .04em; }
        .form-input {
          width: 100%; padding: 12px 14px; border: 1.5px solid var(--sand-dark);
          border-radius: var(--radius-sm); font-family: inherit; font-size: .9rem;
          color: var(--text); background: var(--green-50);
          transition: border-color .2s;
          outline: none;
        }
        .form-input:focus { border-color: var(--green-500); background: #fff; }
        .pay-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .pay-method {
          padding: 14px; border: 2px solid var(--sand-dark); border-radius: var(--radius-sm);
          cursor: pointer; text-align: center; transition: all .2s;
          background: var(--green-50);
        }
        .pay-method.active { border-color: var(--green-600); background: var(--green-100); }
        .pay-method-icon { font-size: 1.4rem; margin-bottom: 4px; }
        .pay-method-name { font-size: .78rem; font-weight: 700; color: var(--green-900); }
        .order-summary { background: var(--green-50); border-radius: var(--radius-sm); padding: 16px; margin: 20px 0; }
        .order-row { display: flex; justify-content: space-between; font-size: .83rem; margin-bottom: 8px; color: var(--text-muted); }
        .order-row.total { font-weight: 800; color: var(--green-900); font-size: .95rem; padding-top: 8px; border-top: 1.5px solid var(--sand-dark); margin-top: 8px; }
        .btn-pay {
          width: 100%; padding: 14px; border: none; border-radius: var(--radius-sm);
          background: linear-gradient(135deg, var(--green-800), var(--green-500));
          color: #fff; font-family: inherit; font-size: 1rem; font-weight: 800;
          cursor: pointer; transition: opacity .2s, transform .15s;
        }
        .btn-pay:hover { opacity: .92; transform: translateY(-1px); }
        .success-state { text-align: center; padding: 40px 28px; }
        .success-icon { font-size: 4rem; margin-bottom: 16px; animation: bounce .5s ease; }
        @keyframes bounce { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-12px) } }
        .success-title { font-family: 'Fraunces', serif; font-size: 1.6rem; color: var(--green-800); margin-bottom: 10px; }
        .success-desc { color: var(--text-muted); font-size: .9rem; line-height: 1.6; }
        .btn-back {
          margin-top: 24px; padding: 12px 28px; border: 2px solid var(--green-700);
          background: transparent; border-radius: var(--radius-sm);
          color: var(--green-800); font-family: inherit; font-size: .9rem; font-weight: 700;
          cursor: pointer; transition: all .2s;
        }
        .btn-back:hover { background: var(--green-100); }

        /* ── FOOTER ── */
        footer {
          background: var(--green-900); color: rgba(255,255,255,.7);
          text-align: center; padding: 36px 24px;
          font-size: .82rem; line-height: 1.8;
        }
        footer strong { color: #fff; }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hero { padding: 56px 20px; min-height: 360px; }
          .hero-stats { gap: 24px; }
          .cart-dropdown { width: 320px; right: -8px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#" className="nav-brand">
          <div className="nav-logo">
            <Image
              src="/logo.png"
              alt="Logo Pusat UKM"
              width={40}
              height={40}
              priority
            />
          </div>
          <div>
            <div className="nav-title">Pusat UKM</div>
            <div className="nav-sub">Sukoharjo</div>
          </div>
        </a>

        <div className="nav-links">
          <a href="#produk">Produk</a>
          <a href="#keunggulan">Keunggulan</a>
          <a href="#kontak">Kontak</a>
        </div>

        <div className="nav-right" ref={cartRef}>
          <button className="cart-btn" onClick={() => setCartOpen((v) => !v)}>
            🛒 Keranjang
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {cartOpen && (
            <div className="cart-dropdown">
              <div className="cart-head">
                <span>🛒 Keranjang Belanja</span>
                <span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>{itemCount} item</span>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🛒</div>
                  Keranjang masih kosong
                </div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">{RUPIAH(item.price)}/{item.unit}</div>
                      </div>
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                        <span className="qty-num">{item.qty}</span>
                        <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="cart-foot">
                  <div className="cart-total">
                    <span>Total</span>
                    <span style={{ color: "var(--green-700)" }}>{RUPIAH(total)}</span>
                  </div>
                  <button className="btn-checkout" onClick={handleCheckout}>
                    Lanjut Pembayaran →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">🌱 Eco · Inovatif · Lokal</div>
          <h1>
            Paving dari Kertas,<br />
            <em>Solusi Ramah Lingkungan</em>
          </h1>
          <p className="hero-desc">
            Produk paving inovatif berbahan dasar kertas daur ulang dari Pusat UKM Sukoharjo.
            Kuat, estetik, dan berkelanjutan untuk hunian dan lingkungan Anda.
          </p>
          <div className="hero-stats">
            {[
              { num: "500+", label: "Pelanggan Puas" },
              { num: "6", label: "Varian Produk" },
              { num: "100%", label: "Kertas Daur Ulang" },
              { num: "4.9★", label: "Rating" },
            ].map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="produk" className="section">
        <div className="section-header">
          <h2 className="section-title">Koleksi Paving Kami</h2>
          <p className="section-sub">Pilih paving yang sesuai kebutuhan dan selera Anda</p>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((p) => (
            <div className="card" key={p.id}>
              <div className="card-img-wrap">
                <img src={p.image} alt={p.name} className="card-img" loading="lazy" />
                {p.badge && <span className="card-badge">{p.badge}</span>}
              </div>
              <div className="card-body">
                <div className="card-name">{p.name}</div>
                <div className="card-desc">{p.desc}</div>
                <div className="card-footer">
                  <div>
                    <div className="card-price">{RUPIAH(p.price)}</div>
                    <div className="card-unit">per {p.unit}</div>
                  </div>
                  <button
                    className={`btn-add${addedId === p.id ? " added" : ""}`}
                    onClick={() => addToCart(p)}
                  >
                    {addedId === p.id ? "✓ Ditambah!" : "+ Keranjang"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ── */}
      <section id="keunggulan" style={{ background: "var(--green-900)", padding: "0" }}>
        <div className="section">
          <div className="section-header">
            <h2 className="section-title" style={{ color: "#fff" }}>Mengapa Pilih Kami?</h2>
            <p className="section-sub" style={{ color: "rgba(255,255,255,.6)" }}>
              Keunggulan produk paving kertas dari Pusat UKM Sukoharjo
            </p>
          </div>
          <div className="why-grid">
            {[
              { icon: "♻️", title: "100% Daur Ulang", desc: "Dibuat dari kertas limbah yang diproses dengan teknologi ramah lingkungan." },
              { icon: "💪", title: "Kuat & Tahan Lama", desc: "Kuat menahan beban hingga 300 kg/m² dengan ketahanan cuaca optimal." },
              { icon: "🎨", title: "Estetik & Variatif", desc: "Tersedia berbagai motif dan warna yang mempercantik halaman Anda." },
              { icon: "🚚", title: "Antar ke Lokasi", desc: "Layanan pengiriman ke seluruh wilayah Sukoharjo dan sekitarnya." },
              { icon: "💰", title: "Harga Terjangkau", desc: "Harga kompetitif langsung dari produsen tanpa perantara." },
              { icon: "🌱", title: "Sertifikat Eco", desc: "Produk bersertifikat ramah lingkungan dari lembaga terpercaya." },
            ].map((w) => (
              <div className="why-card" key={w.title}>
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="kontak">
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
          <Image
            src="/logo.png"
            alt="Logo Pusat UKM"
            width={50}
            height={50}
          />
        </div>
        <strong>Pusat UKM Sukoharjo</strong>
        <br />
        Paving Inovatif Berbahan Kertas Daur Ulang
        <br />
        📍 Sukoharjo, Jawa Tengah &nbsp;|&nbsp; 📞 0271-XXXXXX &nbsp;|&nbsp; 📧 info@pusatukm-sukoharjo.id
        <br />
        <span style={{ fontSize: ".75rem", marginTop: 12, display: "block", opacity: .5 }}>
          © {new Date().getFullYear()} Pusat UKM Sukoharjo · Membangun Ekonomi Lokal yang Berkelanjutan
        </span>
      </footer>

      {/* ── PAYMENT MODAL ── */}
      {payOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-head">
              <span className="modal-title">
                {payStep === "success" ? "✅ Pesanan Berhasil" : payStep === "confirm" ? "📋 Konfirmasi Pesanan" : "💳 Pembayaran"}
              </span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {payStep === "success" && (
              <div className="success-state">
                <div className="success-icon">🎉</div>
                <h3 className="success-title">Terima Kasih, {form.name}!</h3>
                <p className="success-desc">
                  Pesanan Anda telah diterima. Tim kami akan segera menghubungi Anda melalui nomor <strong>{form.phone}</strong> untuk konfirmasi dan pengiriman ke alamat yang tercantum.
                </p>
                <button className="btn-back" onClick={closeModal}>← Kembali Belanja</button>
              </div>
            )}

            {payStep === "confirm" && (
              <div className="modal-body">
                <div className="order-summary">
                  <div style={{ fontWeight: 800, marginBottom: 12, fontSize: ".9rem" }}>📦 Detail Pesanan</div>
                  {cart.map((i) => (
                    <div className="order-row" key={i.id}>
                      <span>{i.name} ×{i.qty}</span>
                      <span>{RUPIAH(i.price * i.qty)}</span>
                    </div>
                  ))}
                  <div className="order-row total">
                    <span>Total Pembayaran</span>
                    <span>{RUPIAH(total)}</span>
                  </div>
                </div>
                <div className="order-summary" style={{ marginTop: 0 }}>
                  <div style={{ fontWeight: 800, marginBottom: 12, fontSize: ".9rem" }}>👤 Info Penerima</div>
                  {[["Nama", form.name], ["Telepon", form.phone], ["Alamat", form.address], ["Metode", form.method === "transfer" ? "Transfer Bank" : form.method === "ewallet" ? "E-Wallet" : "COD (Bayar di Tempat)"]].map(([k, v]) => (
                    <div className="order-row" key={k}><span>{k}</span><span style={{ fontWeight: 600, color: "var(--text)" }}>{v}</span></div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button className="btn-back" style={{ flex: 1 }} onClick={() => setPayStep("form")}>← Edit</button>
                  <button className="btn-pay" style={{ flex: 2 }} onClick={handleConfirm}>✅ Konfirmasi Pesanan</button>
                </div>
              </div>
            )}

            {payStep === "form" && (
              <div className="modal-body">
                <div className="order-summary">
                  {cart.map((i) => (
                    <div className="order-row" key={i.id}>
                      <span>{i.name} ×{i.qty}</span>
                      <span>{RUPIAH(i.price * i.qty)}</span>
                    </div>
                  ))}
                  <div className="order-row total">
                    <span>Total</span>
                    <span>{RUPIAH(total)}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input className="form-input" placeholder="Contoh: Budi Santoso" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp</label>
                  <input className="form-input" placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Alamat Pengiriman</label>
                  <textarea className="form-input" rows={3} placeholder="Jl. ..." value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Metode Pembayaran</label>
                  <div className="pay-methods">
                    {[
                      { key: "transfer", icon: "🏦", label: "Transfer Bank" },
                      { key: "ewallet", icon: "📱", label: "E-Wallet" },
                      { key: "cod", icon: "💵", label: "COD" },
                      { key: "qris", icon: "⬛", label: "QRIS" },
                    ].map((m) => (
                      <div
                        key={m.key}
                        className={`pay-method${form.method === m.key ? " active" : ""}`}
                        onClick={() => setForm({ ...form, method: m.key })}
                      >
                        <div className="pay-method-icon">{m.icon}</div>
                        <div className="pay-method-name">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-pay" onClick={handlePay}>Lanjut ke Konfirmasi →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
