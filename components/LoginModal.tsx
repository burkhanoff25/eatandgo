'use client';

import React, { useState } from 'react';
import { X, Phone, Lock, User, Calendar, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOTP: (phone: string, name?: string, birthday?: string) => Promise<any>;
  onVerifyOTP: (phone: string, code: string) => Promise<any>;
  onGoogleLogin?: () => Promise<any>;
}

export default function LoginModal({ isOpen, onClose, onSendOTP, onVerifyOTP, onGoogleLogin }: LoginModalProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const formatPhone = (val: string) => {
    const num = val.replace(/\D/g, '');
    let formatted = '';
    if (num.startsWith('7') || num.startsWith('8')) {
      formatted = '+7 ';
      const rem = num.substring(1);
      if (rem.length > 0) formatted += '(' + rem.substring(0, 3);
      if (rem.length >= 4) formatted += ') ' + rem.substring(3, 6);
      if (rem.length >= 7) formatted += '-' + rem.substring(6, 8);
      if (rem.length >= 9) formatted += '-' + rem.substring(8, 10);
    } else {
      if (num.length > 0) formatted = '+' + num.substring(0, 15);
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    setLoading(true);
    try {
      await onSendOTP(phone, isRegistering ? name : undefined, isRegistering ? birthday : undefined);
      toast.success('Код отправлен (используйте 1234)');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      toast.error('Введите код подтверждения');
      return;
    }
    setLoading(true);
    try {
      await onVerifyOTP(phone, code);
      toast.success('Авторизация успешна!');
      onClose();
      setPhone('');
      setCode('');
      setName('');
      setBirthday('');
      setStep('phone');
    } catch (err: any) {
      toast.error(err.message || 'Неверный код подтверждения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      {/* Modal Dialog Card */}
      <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-250">
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white hover:text-brand-green p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
          title="Вернуться в меню"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Brand Banner */}
        <div className="bg-brand-dark p-8 text-center text-white border-b border-white/5 relative overflow-hidden">
          <span className="font-display font-black text-xl tracking-widest text-white block">
            EAT & GO CLUB
          </span>
          <span className="text-[9px] text-brand-yellow font-black tracking-widest uppercase block mt-1">
            Клубная карта Сысерти
          </span>
        </div>

        {step === 'phone' ? (
          /* Step 1 Form */
          <form onSubmit={handleSendOTP} className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-display font-black text-lg text-brand-dark uppercase tracking-wide">
                {isRegistering ? 'Регистрация' : 'Вход в клуб'}
              </h3>
              <p className="font-body text-xs text-gray-400 font-semibold leading-relaxed">
                Введите номер мобильного телефона для входа или регистрации.
              </p>
            </div>

            {/* Selector Tab switcher */}
            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200/50">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                  !isRegistering ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                  isRegistering ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'
                }`}
              >
                Регистрация
              </button>
            </div>

            <div className="space-y-4">
              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Номер телефона</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (999) 999-99-99"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none font-body font-semibold text-xs transition-all text-brand-dark"
                  />
                </div>
              </div>

              {/* Extra Register options */}
              {isRegistering && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Ваше имя</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Иван"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none font-body font-semibold text-xs transition-all text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Дата рождения</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none font-body font-semibold text-xs transition-all text-brand-dark"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-red hover:bg-red-750 text-white font-bold py-4 rounded-2xl text-center shadow-lg transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? 'Отправка...' : 'Отправить СМС с кодом'}
            </button>

            {onGoogleLogin && (
              <>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-wider">или</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    if (onGoogleLogin) {
                      setLoading(true);
                      try {
                        await onGoogleLogin();
                        onClose();
                      } catch (err: any) {
                        toast.error(err.message || 'Ошибка авторизации Google');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="w-full bg-white hover:bg-gray-50 text-brand-dark border border-gray-200 font-bold py-4 rounded-2xl text-center shadow-sm transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.823-6.3-6.3s2.822-6.3 6.3-6.3c1.63 0 3.11.624 4.228 1.636l3.204-3.204C19.23 2.54 15.9 1.3 12.24 1.3 6.082 1.3 1.1 6.282 1.1 12.44s4.982 11.14 11.14 11.14c6.31 0 10.5-4.43 10.5-10.7 0-.72-.064-1.408-.186-2.072H12.24z"
                    />
                  </svg>
                  <span>Войти через Google</span>
                </button>
              </>
            )}
          </form>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleVerifyOTP} className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-display font-black text-lg text-brand-dark uppercase tracking-wide pt-2">
                Подтверждение
              </h3>
              <p className="font-body text-xs text-gray-400 font-semibold leading-relaxed">
                Введите проверочный 4-значный код из СМС, отправленный на <strong className="text-brand-dark">{phone}</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block text-center">Код подтверждения</label>
              <div className="relative max-w-[180px] mx-auto">
                <Lock className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none font-display font-black tracking-widest text-center text-base transition-all text-brand-dark"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-red hover:bg-red-750 text-white font-bold py-4 rounded-2xl text-center shadow-lg transition-all disabled:bg-gray-200 disabled:text-gray-400 text-xs uppercase tracking-wider cursor-pointer"
              >
                {loading ? 'Проверка...' : 'Подтвердить и войти'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs font-bold text-gray-400 hover:text-brand-dark transition-all py-2 cursor-pointer"
              >
                Изменить номер телефона
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
