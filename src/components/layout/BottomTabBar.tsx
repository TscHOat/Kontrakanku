import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { path: '/', label: 'Kontrakan', icon: '🏠' },
    { path: '/settings', label: 'Pengaturan', icon: '⚙️' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-[calc(var(--tab-bar)+var(--safe-bottom))] border-t-[0.5px] border-[var(--separator)] bg-[var(--surface)] pb-[var(--safe-bottom)]">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-1 flex-col items-center justify-center gap-[2px] active:opacity-50"
          >
            <span className="text-[22px] leading-none">{tab.icon}</span>
            <span
              className={`text-[10px] ${
                active ? 'text-[var(--accent)]' : 'text-[var(--fg-tertiary)]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
