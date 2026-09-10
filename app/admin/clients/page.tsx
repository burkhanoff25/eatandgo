'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { UserProfile } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { Phone, Award, AwardIcon } from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setClients(data);
      }
    };
    fetchClients();
  }, []);

  const getTierBadgeColor = (level: string) => {
    switch (level) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Постоянный': return 'bg-blue-100 text-blue-800';
      case 'Новичок': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 p-8 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="font-display font-black text-3xl text-brand-dark uppercase tracking-tight">Клиенты лояльности</h1>
          <p className="font-body text-gray-500 text-sm mt-1">Список зарегистрированных членов бонусной системы.</p>
        </div>

        {/* Clients list table */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-150">
                  <th className="p-4 pl-6">Клиент</th>
                  <th className="p-4">Телефон</th>
                  <th className="p-4">Уровень</th>
                  <th className="p-4">Потрачено</th>
                  <th className="p-4">Бонусы</th>
                  <th className="p-4 pr-6">Дата регистрации</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50/50">
                    <td className="p-4 pl-6">
                      <span className="text-brand-dark block">{client.name || 'Гость'}</span>
                      {client.birthday && (
                        <span className="text-[10px] text-gray-400 block font-normal mt-0.5">
                          ДР: {new Date(client.birthday).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-normal text-gray-500">
                      <span className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        <span>{client.phone}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getTierBadgeColor(client.level)}`}>
                        {client.level}
                      </span>
                    </td>
                    <td className="p-4 font-display font-black text-brand-dark">
                      {client.total_spent} ₽
                    </td>
                    <td className="p-4 font-display font-black text-primary-red">
                      {client.bonus_balance} ₽
                    </td>
                    <td className="p-4 pr-6 text-gray-400 font-normal">
                      {new Date(client.created_at).toLocaleDateString('ru-RU')}
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
