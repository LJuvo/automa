import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wind } from 'lucide-react';

export function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState('zhanggong');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('8K3M');
  const [captchaInput, setCaptchaInput] = useState('');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/workbench');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0e7490] via-[#155e75] to-[#0891b2] relative overflow-hidden">
      {/* 左侧品牌区 */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-white p-16 relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="waves" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 20, 50 50 T 100 50 T 150 50 T 200 50" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Wind size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-3">湿地自然保护区</h1>
          <h2 className="text-2xl font-medium opacity-90 mb-8">智慧生态管理平台</h2>
          <p className="text-sm opacity-70 max-w-md leading-relaxed">
            全厂工艺流程监控 · 设备远程操作 · 报警智能处置 · 数据分析决策支持
          </p>
        </div>
      </div>

      {/* 右侧登录框 */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-8">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6 text-pri-d">
            <Wind size={28} />
            <span className="text-lg font-bold">湿地生态平台</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">账号登录</h3>
          <p className="text-xs text-gray-500 mb-6">请使用系统分配的账号密码登录</p>

          <div className="space-y-4">
            {/* 账号 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">账号</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入账号"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-pri focus:ring-2 focus:ring-pri-l outline-none text-sm transition"
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">密码</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-pri focus:ring-2 focus:ring-pri-l outline-none text-sm transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 验证码 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  placeholder="请输入验证码"
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-200 focus:border-pri focus:ring-2 focus:ring-pri-l outline-none text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setCaptcha(String(Math.random()).slice(2, 6).toUpperCase())}
                  className="h-10 w-28 rounded-lg bg-gradient-to-r from-cyan-600 to-pri text-white font-mono text-lg font-bold tracking-widest select-none"
                  style={{ letterSpacing: '0.3em' }}
                >
                  {captcha}
                </button>
              </div>
            </div>

            {/* 记住我/忘记密码 */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-pri focus:ring-pri"
                />
                <span className="text-gray-600">记住我</span>
              </label>
              <a className="text-pri hover:underline cursor-pointer">忘记密码？</a>
            </div>

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-[#0e7490] to-[#0891b2] text-white font-semibold text-sm hover:shadow-lg hover:opacity-95 transition-all"
            >
              登 录
            </button>
          </div>

          <div className="mt-6 text-center text-[11px] text-gray-400">
            v1.0 © 2026 湿地自然保护区智慧生态管理平台
          </div>
        </div>
      </div>
    </div>
  );
}
