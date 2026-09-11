import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Lock, User, ShieldCheck, Eye, EyeOff, MapPin, Leaf } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState('zhanggong');
  const [pwd, setPwd] = useState('123456');
  const [captcha, setCaptcha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/workbench');
  };

  return (
    <div className="h-full w-full flex relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, oklch(28% 0.09 210) 0%, oklch(38% 0.10 200) 40%, oklch(55% 0.13 190) 100%)' }}>

      {/* Decorative pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Soft radial glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 30%, oklch(70% 0.15 190 / 0.25), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(55% 0.12 210 / 0.2), transparent 55%)'
      }} />

      {/* Left brand panel */}
      <div className="flex-1 hidden lg:flex flex-col justify-between p-12 text-white relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Wind size={22} />
          </div>
          <div>
            <div className="text-[15px] font-semibold leading-tight tracking-wide">湿地智慧生态管理平台</div>
            <div className="text-[11px] opacity-60 mt-0.5">WETLAND · SMART · ECOLOGICAL</div>
          </div>
        </div>

        <div>
          <h1 className="text-[42px] leading-[1.15] font-bold tracking-tight mb-5">
            守护一片湿地<br />
            <span className="opacity-70">让每一滴水都清澈可溯</span>
          </h1>
          <div className="flex gap-5 text-[12.5px] text-white/70">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} /> 赣州蓉江新区
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf size={14} /> 6 个子项 · 23 万吨/日
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} /> L3 等保合规
            </div>
          </div>
        </div>

        <div className="text-[11px] text-white/50">© 2026 智慧湿地生态科技 · 工业互联网架构 v3.2</div>
      </div>

      {/* Right login card */}
      <div className="w-full lg:w-[460px] flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-[380px]">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-6 text-white">
            <Wind size={20} />
            <div className="text-[13px] font-semibold">湿地智慧生态</div>
          </div>

          <div className="bg-[var(--surface-2)] rounded-2xl p-8 shadow-[var(--shadow-xl)] border border-white/10">
            <div className="mb-7">
              <h2 className="text-[22px] font-bold text-[var(--neutral-900)] tracking-tight leading-tight">登录平台</h2>
              <p className="text-[12.5px] text-[var(--neutral-500)] mt-1">请使用您的企业账号登录</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {/* Account */}
              <div>
                <label className="block text-[12px] text-[var(--neutral-600)] mb-1.5 font-medium">账号</label>
                <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)] focus-within:border-[var(--brand-500)] focus-within:bg-white transition">
                  <User size={15} className="text-[var(--neutral-400)]" />
                  <input type="text" value={user} onChange={e => setUser(e.target.value)}
                    placeholder="请输入账号" className="flex-1 bg-transparent outline-none text-[13px]" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] text-[var(--neutral-600)] mb-1.5 font-medium">密码</label>
                <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)] focus-within:border-[var(--brand-500)] focus-within:bg-white transition">
                  <Lock size={15} className="text-[var(--neutral-400)]" />
                  <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)}
                    placeholder="请输入密码" className="flex-1 bg-transparent outline-none text-[13px]" />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="text-[var(--neutral-400)] hover:text-[var(--neutral-600)]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-[12px] text-[var(--neutral-600)] mb-1.5 font-medium">验证码</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)] focus-within:border-[var(--brand-500)] focus-within:bg-white transition flex-1">
                    <ShieldCheck size={15} className="text-[var(--neutral-400)]" />
                    <input type="text" value={captcha} onChange={e => setCaptcha(e.target.value)}
                      placeholder="ABCD" className="flex-1 bg-transparent outline-none text-[13px] tracking-widest" />
                  </div>
                  <div className="h-10 w-[110px] rounded-lg overflow-hidden bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-700)] flex items-center justify-center text-white font-bold text-[18px] tracking-[6px] font-mono select-none"
                    style={{ fontFamily: "'Courier New', monospace", textShadow: '1px 1px 0 rgba(0,0,0,0.15)' }}>
                    4F2K
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] pt-1">
                <label className="flex items-center gap-1.5 text-[var(--neutral-600)] cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="accent-[var(--brand-500)]" />
                  记住账号
                </label>
                <a className="text-[var(--brand-600)] hover:underline cursor-pointer">忘记密码？</a>
              </div>

              <button type="submit"
                className="w-full h-10 rounded-lg bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white font-semibold text-[13px] shadow-[0_1px_2px_rgb(15_23_42_/_0.15)] transition mt-2">
                登录平台
              </button>

              <div className="flex items-center gap-3 pt-4 text-[11px] text-[var(--neutral-500)]">
                <div className="flex-1 h-px bg-[var(--neutral-200)]"></div>
                <span>演示账号</span>
                <div className="flex-1 h-px bg-[var(--neutral-200)]"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {[
                  { u: 'zhanggong', r: '工程师' },
                  { u: 'lichu', r: '操作员' },
                  { u: 'admin', r: '管理员' },
                ].map(x => (
                  <button key={x.u} type="button" onClick={() => { setUser(x.u); setPwd('123456'); }}
                    className="py-1.5 rounded-md border border-[var(--neutral-200)] hover:bg-[var(--neutral-50)] text-[var(--neutral-600)] transition">
                    <div className="font-medium text-[var(--neutral-800)]">{x.u}</div>
                    <div className="text-[10px] opacity-60">{x.r}</div>
                  </button>
                ))}
              </div>
            </form>
          </div>

          <p className="text-[11px] text-center text-white/50 mt-5">遇到问题？联系 400-888-0797 · admin@wetland.com</p>
        </div>
      </div>
    </div>
  );
}
