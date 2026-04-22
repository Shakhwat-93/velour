import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Megaphone, Link as LinkIcon, Save, Sparkles, Image as ImageIcon, Type, FileText, Gift, Eye, Truck, KeyRound, ShieldCheck, CheckCircle } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const fetchSettings = async () => {
    const { data } = await (supabase as any).from('site_settings').select('*')
    if (data) {
      const obj = data.reduce((acc: any, row: any) => ({ ...acc, [row.key]: row.value }), {})
      setSettings(obj)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedMessage('')

    const payload = Object.entries(settings).map(([key, value]) => ({ key, value }))
    await (supabase as any).from('site_settings').upsert(payload)

    setSaving(false)
    setSavedMessage('Settings saved successfully.')
    window.setTimeout(() => setSavedMessage(''), 3200)
  }

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
      <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#71675d' }}>Loading Settings...</p>
    </div>
  )

  return (
    <div className="max-w-3xl space-y-8 sm:space-y-12 pb-24 sm:pb-32">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <h4 className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: '#c9a472' }}>Management</h4>
        <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
          Settings
        </h1>
        <p className="text-[13px] sm:text-[14px] font-medium max-w-xl" style={{ color: '#71675d' }}>
          Configure global store options and announcement banners.
        </p>
      </div>

      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border px-5 py-4"
          style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
        >
          <CheckCircle size={18} strokeWidth={2.2} />
          <p className="text-[13px] font-bold">{savedMessage}</p>
        </motion.div>
      )}

      {/* Courier Integration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
      >
        <div className="px-5 py-5 sm:px-10 sm:py-8 border-b flex items-center gap-4 sm:gap-5" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Truck size={24} style={{ color: '#4f46e5' }} strokeWidth={1.7} />
          </div>
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight" style={{ color: '#181511' }}>Courier Integration (Steadfast)</h2>
            <p className="text-[11px] sm:text-[12px] font-medium mt-1" style={{ color: '#71675d' }}>Create Steadfast courier entries from the admin order panel</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-5 sm:p-10 space-y-7 sm:space-y-8">
          <div className="space-y-6">
            <div className="rounded-[20px] border p-4 sm:p-5 space-y-5" style={{ borderColor: 'rgba(79,70,229,0.14)', background: '#f8f7ff' }}>
              <div>
                <h3 className="text-[13px] font-black tracking-[0.16em] uppercase" style={{ color: '#181511' }}>Primary Steadfast Account</h3>
                <p className="mt-1 text-[12px] font-medium" style={{ color: '#71675d' }}>This account is used every time you send an order.</p>
              </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <KeyRound size={14} style={{ color: '#4f46e5' }} /> API Key
              </label>
              <input
                type="password"
                value={settings['steadfast_api_key'] || ''}
                onChange={e => setSettings({ ...settings, steadfast_api_key: e.target.value })}
                placeholder="Paste Steadfast API key"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <ShieldCheck size={14} style={{ color: '#4f46e5' }} /> Secret Key
              </label>
              <input
                type="password"
                value={settings['steadfast_secret_key'] || ''}
                onChange={e => setSettings({ ...settings, steadfast_secret_key: e.target.value })}
                placeholder="Paste Steadfast secret key"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                autoComplete="off"
              />
            </div>
            </div>

            <div className="rounded-[20px] border p-4 sm:p-5 space-y-5" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div>
                <h3 className="text-[13px] font-black tracking-[0.16em] uppercase" style={{ color: '#181511' }}>Second Steadfast Account</h3>
                <p className="mt-1 text-[12px] font-medium" style={{ color: '#71675d' }}>Optional. If both keys are saved, order will be sent here too.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                  <KeyRound size={14} style={{ color: '#4f46e5' }} /> Second API Key
                </label>
                <input
                  type="password"
                  value={settings['steadfast_secondary_api_key'] || ''}
                  onChange={e => setSettings({ ...settings, steadfast_secondary_api_key: e.target.value })}
                  placeholder="Optional second Steadfast API key"
                  className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                  style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                  <ShieldCheck size={14} style={{ color: '#4f46e5' }} /> Second Secret Key
                </label>
                <input
                  type="password"
                  value={settings['steadfast_secondary_secret_key'] || ''}
                  onChange={e => setSettings({ ...settings, steadfast_secondary_secret_key: e.target.value })}
                  placeholder="Optional second Steadfast secret key"
                  className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                  style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border p-4 sm:p-5 space-y-5" style={{ background: '#faf9f7', borderColor: 'rgba(24,21,17,0.06)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-bold" style={{ color: '#181511' }}>Enable Integration</p>
                <p className="mt-1 text-[12px] font-medium" style={{ color: '#71675d' }}>Allow admin panel to send orders to Steadfast.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, steadfast_enabled: settings['steadfast_enabled'] === 'true' ? 'false' : 'true' })}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 ${settings['steadfast_enabled'] === 'true' ? 'bg-[#4f46e5]' : 'bg-[#e5e0d8]'}`}
                aria-pressed={settings['steadfast_enabled'] === 'true'}
              >
                <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings['steadfast_enabled'] === 'true' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-bold" style={{ color: '#181511' }}>Auto-Dispatch</p>
                <p className="mt-1 text-[12px] font-medium" style={{ color: '#71675d' }}>Saved for workflow automation; manual dispatch remains available.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, steadfast_auto_dispatch: settings['steadfast_auto_dispatch'] === 'true' ? 'false' : 'true' })}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 ${settings['steadfast_auto_dispatch'] === 'true' ? 'bg-[#4f46e5]' : 'bg-[#e5e0d8]'}`}
                aria-pressed={settings['steadfast_auto_dispatch'] === 'true'}
              >
                <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings['steadfast_auto_dispatch'] === 'true' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 sm:pt-8 flex">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-10 h-12 sm:h-14 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              style={{ background: '#4f46e5', color: '#fff' }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }} />
              ) : (
                <Save size={16} strokeWidth={3} />
              )}
              {saving ? 'Saving...' : 'Save Courier Settings'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Settings Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
      >
        <div className="px-5 py-5 sm:px-10 sm:py-8 border-b flex items-center gap-4 sm:gap-5" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Megaphone size={24} style={{ color: '#181511' }} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight" style={{ color: '#181511' }}>Announcement Bar</h2>
            <p className="text-[11px] sm:text-[12px] font-medium mt-1" style={{ color: '#71675d' }}>Displayed at the top of the store</p>
          </div>
        </div>
        
        <form onSubmit={handleSave} className="p-5 sm:p-10 space-y-7 sm:space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                Announcement Message
              </label>
              <input 
                type="text" 
                value={settings['announcement_text'] || ''} 
                onChange={e => setSettings({...settings, announcement_text: e.target.value})} 
                placeholder="e.g. Dhaka delivery ৳80, outside Dhaka ৳130"
              className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(201,164,114,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(24,21,17,0.06)'}
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <LinkIcon size={14} style={{ color: '#c9a472' }} /> Redirect Link (Optional)
              </label>
              <input 
                type="text" 
                value={settings['announcement_link'] || ''} 
                onChange={e => setSettings({...settings, announcement_link: e.target.value})} 
                placeholder="e.g. /shop"
              className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(201,164,114,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(24,21,17,0.06)'}
              />
            </div>
          </div>

          <div className="pt-4 sm:pt-8 flex">
            <button 
              type="submit" 
              disabled={saving} 
              className="w-full sm:w-auto px-10 h-12 sm:h-14 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              style={{ background: '#181511', color: '#fff' }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }} />
              ) : (
                <Save size={16} strokeWidth={3} />
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
      {/* Promo Popup Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
      >
        <div className="px-5 py-5 sm:px-10 sm:py-8 border-b flex items-center gap-4 sm:gap-5" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Sparkles size={24} style={{ color: '#c9a472' }} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight" style={{ color: '#181511' }}>Promo Popup Card</h2>
            <p className="text-[11px] sm:text-[12px] font-medium mt-1" style={{ color: '#71675d' }}>Configure the marketing popup shown to visitors</p>
          </div>
        </div>
        
        <form onSubmit={handleSave} className="p-5 sm:p-10 space-y-7 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Status */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border" style={{ background: '#faf9f7', borderColor: 'rgba(24,21,17,0.06)' }}>
                <div className="flex items-center gap-3">
                  <Eye size={16} className="text-[#c9a472]" />
                  <span className="text-[11px] font-black tracking-widest uppercase">Enable Popup</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSettings({...settings, promo_enabled: settings['promo_enabled'] === 'true' ? 'false' : 'true'})}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings['promo_enabled'] === 'true' ? 'bg-[#c9a472]' : 'bg-[#e5e0d8]'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${settings['promo_enabled'] === 'true' ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <Type size={14} style={{ color: '#c9a472' }} /> Subtitle
              </label>
              <input 
                type="text" 
                value={settings['promo_subtitle'] || ''} 
                onChange={e => setSettings({...settings, promo_subtitle: e.target.value})} 
                placeholder="e.g. Velour Private Collection"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
              />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <Type size={14} style={{ color: '#c9a472' }} /> Main Title
              </label>
              <input 
                type="text" 
                value={settings['promo_title'] || ''} 
                onChange={e => setSettings({...settings, promo_title: e.target.value})} 
                placeholder="e.g. Eid Special Discount"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
              />
            </div>

            {/* Description */}
            <div className="space-y-3 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <FileText size={14} style={{ color: '#c9a472' }} /> Description
              </label>
              <textarea 
                value={settings['promo_description'] || ''} 
                onChange={e => setSettings({...settings, promo_description: e.target.value})} 
                placeholder="Enter the popup message..."
                className="w-full p-5 sm:p-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300 min-h-[100px]"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
              />
            </div>

            {/* Promo Code */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <Gift size={14} style={{ color: '#c9a472' }} /> Discount Code
              </label>
              <input 
                type="text" 
                value={settings['promo_code'] || ''} 
                onChange={e => setSettings({...settings, promo_code: e.target.value})} 
                placeholder="e.g. VELOUR20"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-bold outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
              />
            </div>

            {/* Button Text */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <Type size={14} style={{ color: '#c9a472' }} /> Button Text
              </label>
              <input 
                type="text" 
                value={settings['promo_button_text'] || ''} 
                onChange={e => setSettings({...settings, promo_button_text: e.target.value})} 
                placeholder="e.g. Claim My Discount"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-3 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                <ImageIcon size={14} style={{ color: '#c9a472' }} /> Image URL
              </label>
              <input 
                type="text" 
                value={settings['promo_image'] || ''} 
                onChange={e => setSettings({...settings, promo_image: e.target.value})} 
                placeholder="e.g. /promo.png"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
              />
            </div>
          </div>

          <div className="pt-4 sm:pt-8 flex">
            <button 
              type="submit" 
              disabled={saving} 
              className="w-full sm:w-auto px-10 h-12 sm:h-14 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              style={{ background: '#181511', color: '#fff' }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }} />
              ) : (
                <Save size={16} strokeWidth={3} />
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
