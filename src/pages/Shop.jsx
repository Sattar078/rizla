import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const category = searchParams.get('category') || 'all';
  const q = searchParams.get('q') || '';

  useEffect(() => {
    setLoading(true);
    api.products.getAll({ category, q, collection: searchParams.get('collection') || '', sale: searchParams.get('sale') || '' })
      .then(({ products: items }) => setProducts(items))
      .finally(() => setLoading(false));
  }, [category, q, searchParams]);

  useEffect(() => { api.products.getCategories().then(({ categories: items }) => setCategories(items)); }, []);

  return <main className="min-h-screen pt-32 pb-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[.3em] text-accent">RIZLA Boutique</p>
      <h1 className="mt-2 font-playfair text-4xl font-bold text-white">Shop the collection</h1>
      <div className="mt-7 flex flex-wrap gap-2">{categories.map((item) => <Link key={item.id} to={`/shop?category=${item.id}`} className={`rounded-full border px-4 py-2 text-sm ${category === item.id ? 'border-accent bg-accent text-background' : 'border-white/20 text-gray-300 hover:border-accent'}`}>{item.label}</Link>)}</div>
      {loading ? <div className="py-20 text-center text-accent">Loading products…</div> : products.length === 0 ? <p className="py-20 text-center text-gray-300">No products found. Try another search or category.</p> : <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <article key={product.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="aspect-square w-full object-cover" /></Link><div className="p-5"><p className="text-xs uppercase tracking-widest text-accent">{product.brand}</p><Link to={`/product/${product.id}`}><h2 className="mt-2 font-playfair text-xl text-white">{product.name}</h2></Link><p className="mt-3 text-lg font-bold text-accent">${product.price.toFixed(2)}</p><div className="mt-4 flex gap-2"><button onClick={() => addToCart(product.id)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-bold text-background"><FiShoppingBag /> Add</button><button onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist" className={`rounded-full border px-3 ${isInWishlist(product.id) ? 'border-red-400 text-red-400' : 'border-white/20'}`}>♥</button></div></div></article>)}</div>}
    </div>
  </main>;
};

export default Shop;
