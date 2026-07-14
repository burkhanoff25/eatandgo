'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { MENU_ITEMS } from '../../../components/MenuSection';
import { MenuItem } from '../../../types';
import { ToggleLeft, ToggleRight, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  const handleToggleAvailable = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    setItems(updated);
    toast.success('Наличие блюда изменено');
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    toast.success('Блюдо удалено из меню');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.price) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (editingItem.id) {
      // Edit existing
      setItems(prev => prev.map(i => i.id === editingItem.id ? (editingItem as MenuItem) : i));
      toast.success('Блюдо успешно сохранено');
    } else {
      // Create new
      const newItem: MenuItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: editingItem.name,
        description: editingItem.description || '',
        price: editingItem.price,
        category: editingItem.category || 'shaurma',
        image: editingItem.image || '🌯',
        badge: editingItem.badge,
        available: true
      };
      setItems(prev => [...prev, newItem]);
      toast.success('Блюдо добавлено в меню');
    }
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 p-8 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display font-black text-3xl text-brand-dark uppercase tracking-tight">Управление меню</h1>
            <p className="font-body text-gray-500 text-sm mt-1">Добавление, изменение и удаление блюд в меню.</p>
          </div>
          <button
            onClick={() => setEditingItem({ name: '', price: 0, category: 'shaurma', image: '🌯', available: true })}
            className="bg-primary-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить блюдо</span>
          </button>
        </div>

        {/* Edit / Create Overlay Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <h3 className="font-display font-bold text-lg text-brand-dark">
                {editingItem.id ? 'Редактировать блюдо' : 'Добавить новое блюдо'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Название</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none font-semibold text-xs text-brand-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Цена (₽)</label>
                    <input
                      type="number"
                      required
                      value={editingItem.price || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none font-semibold text-xs text-brand-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Категория</label>
                    <select
                      value={editingItem.category}
                      onChange={e => setEditingItem(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none font-bold text-xs text-brand-dark"
                    >
                      <option value="shaurma">Шаурма</option>
                      <option value="shashlyk">Шашлык</option>
                      <option value="hotdog">Хот-дог</option>
                      <option value="pita">Пита</option>
                      <option value="drinks">Напитки</option>
                      <option value="combo">Комбо</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Описание</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none font-semibold text-xs text-brand-dark resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Эмодзи иконка</label>
                    <input
                      type="text"
                      value={editingItem.image || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none text-center text-sm font-semibold text-brand-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Бейдж (опц.)</label>
                    <select
                      value={editingItem.badge || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, badge: e.target.value ? e.target.value as any : undefined }))}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none font-bold text-xs text-brand-dark"
                    >
                      <option value="">Без бейджа</option>
                      <option value="ХИТ">ХИТ</option>
                      <option value="NEW">NEW</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-150">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-red hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold py-3.5 rounded-2xl text-xs uppercase"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items Table */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-150">
                  <th className="p-4 pl-6">Иконка</th>
                  <th className="p-4">Название</th>
                  <th className="p-4">Категория</th>
                  <th className="p-4">Цена</th>
                  <th className="p-4">Наличие</th>
                  <th className="p-4 pr-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-4 pl-6 text-3xl select-none">{item.image}</td>
                    <td className="p-4">
                      <span className="text-brand-dark block">{item.name}</span>
                      <span className="text-[10px] text-gray-400 block font-normal font-body mt-0.5 max-w-[250px] truncate">{item.description}</span>
                    </td>
                    <td className="p-4 uppercase text-xs text-gray-400">{item.category}</td>
                    <td className="p-4 font-display font-black text-brand-dark">{item.price} ₽</td>
                    <td className="p-4">
                      <button onClick={() => handleToggleAvailable(item.id)}>
                        {item.available ? (
                          <ToggleRight className="w-9 h-9 text-emerald-500 hover:opacity-85 transition-opacity" />
                        ) : (
                          <ToggleLeft className="w-9 h-9 text-gray-300 hover:opacity-85 transition-opacity" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-gray-400 hover:text-brand-dark p-1 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-300 hover:text-primary-red p-1 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
