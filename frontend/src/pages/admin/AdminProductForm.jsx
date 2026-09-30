import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../services/category.api';

const createFormState = (product) => {
  const variant = product?.variants?.[0] || {};
  return {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category?._id || product?.category || '',
    price: product?.price ?? '',
    size: variant.size || 'M',
    color: variant.color || 'Black',
    stock: variant.stock ?? '0',
  };
};

const AdminProductForm = ({ initialProduct, onSubmit, isSaving, submitLabel }) => {
  const [form, setForm] = useState(() => createFormState(initialProduct));
  const { data: categoryData } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getCategories });
  const categories = categoryData?.categories || categoryData?.data?.categories || [];
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => { event.preventDefault(); onSubmit({ name: form.name.trim(), description: form.description.trim(), category: form.category, price: Number(form.price), variants: [{ size: form.size.trim(), color: form.color.trim(), stock: Number(form.stock) }] }); };
  const inputClass = 'mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-700';
  return <form onSubmit={submit} className="max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><label className="block text-sm font-semibold text-gray-700">Product name<input name="name" value={form.name} onChange={change} required className={inputClass} /></label><label className="block text-sm font-semibold text-gray-700">Description<textarea name="description" value={form.description} onChange={change} required rows="4" className={`${inputClass} resize-y`} /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-gray-700">Category<select name="category" value={form.category} onChange={change} required className={inputClass}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label><label className="block text-sm font-semibold text-gray-700">Price (₹)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required className={inputClass} /></label><label className="block text-sm font-semibold text-gray-700">Size<input name="size" value={form.size} onChange={change} required className={inputClass} /></label><label className="block text-sm font-semibold text-gray-700">Color<input name="color" value={form.color} onChange={change} required className={inputClass} /></label><label className="block text-sm font-semibold text-gray-700 sm:col-span-2">Available stock<input name="stock" type="number" min="0" value={form.stock} onChange={change} required className={inputClass} /></label></div><button disabled={isSaving} className="rounded-full bg-primary-900 px-7 py-3 font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60">{isSaving ? 'Saving…' : submitLabel}</button></form>;
};

export default AdminProductForm;