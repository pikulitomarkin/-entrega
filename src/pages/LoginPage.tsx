import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@oentrega.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, insira email e senha');
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Entrando...');
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!', { id: toastId });
      navigate('/');
    } catch (error: any) {
      console.error('Failed to login', error);
      toast.error(`Falha no login: ${error.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Card Principal */}
      <div className="bg-white rounded-3xl shadow-2xl border border-red-200 p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo</h1>
          <p className="text-gray-600 text-sm">Acesse sua conta para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-3 text-gray-900 bg-gray-50 border border-red-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-4 py-3 text-gray-900 bg-gray-50 border border-red-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md mt-2"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-6 border-t border-red-100 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-white/15 rounded-xl border border-white/30 backdrop-blur-md text-center text-white text-sm shadow-lg">
        <p className="font-medium">Credenciais de teste disponíveis</p>
        <p className="text-white/80 text-xs mt-1">admin@oentrega.com / 123456</p>
      </div>
    </div>
  );
}
