import { useState, useEffect } from 'react';
import { Trophy, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, X } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function Login({ onLogin, onClose, isOpen }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    // Simular requisição de login
    setTimeout(() => {
      // Credenciais de exemplo para teste
      if (email === 'admin@sports.com' && password === 'admin123') {
        onLogin({ email, password });
        onClose();
      } else {
        setError('Email ou senha incorretos');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary)] rounded-2xl mb-4">
            <Trophy className="w-8 h-8 text-[var(--primary-foreground)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[var(--surface-glass)] backdrop-blur-xl rounded-2xl border border-[var(--border)] p-8 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
            Entrar na plataforma
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-[var(--destructive)] flex-shrink-0" />
                <p className="text-sm text-[var(--destructive)]">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] bg-[var(--input-background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  disabled={isLoading}
                />
                <span className="text-sm text-[var(--foreground)]">Lembrar-me</span>
              </label>

              <button
                type="button"
                className="text-sm text-[var(--primary)] hover:underline transition-all"
                disabled={isLoading}
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Credenciais de Demonstração
            </p>
            <div className="space-y-1">
              <p className="text-sm text-[var(--foreground)]">
                <span className="text-[var(--muted-foreground)]">Email:</span> admin@sports.com
              </p>
              <p className="text-sm text-[var(--foreground)]">
                <span className="text-[var(--muted-foreground)]">Senha:</span> admin123
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Não tem uma conta?{' '}
              <button className="text-[var(--primary)] hover:underline font-medium">
                Solicitar acesso
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
