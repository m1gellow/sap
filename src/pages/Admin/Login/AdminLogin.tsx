import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../../lib/context/AdminContext';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';


export const AdminLogin = () => {
  const { adminLogin, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setError('');

    try {
      const success = await adminLogin({ email, password });
      if (success) navigate('/admin');
    } catch (err) {
      setError('Неверные учетные данные');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Логотип и заголовок */}
          <div className="bg-blue p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Админ-панель</h1>
            <p className="text-blue mt-1">Управление магазином</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Электронная почта
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-blue  text-white font-medium rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вход в систему...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-100">
              <div className="bg-blue p-3 rounded-lg">
                <p className="text-sm text-white font-medium">Тестовые данные для входа:</p>
                <div className="mt-2 text-sm text-white space-y-1">
                  <p>Email: <span className="font-semibold">admin@example.com</span></p>
                  <p>Пароль: <span className="font-semibold">admin123</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="inline-flex items-center text-sm text-blue  font-medium"
          >
            Вернуться на главную <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};