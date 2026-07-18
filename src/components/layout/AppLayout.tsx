import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'
import { ChevronLeft } from 'lucide-react'

const titles: Record<string, string> = {
  '/': 'Kontrakan',
  '/settings': 'Pengaturan',
  '/property/new': 'Tambah Kontrakan',
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const showTabs = ['/', '/settings'].includes(location.pathname)
  const hasBack = !showTabs

  let title = titles[location.pathname]
  if (!title) {
    if (location.pathname.match(/^\/property\/\d+\/edit$/)) title = 'Edit Kontrakan'
    else if (location.pathname.match(/^\/property\/\d+$/)) title = 'Detail Kontrakan'
    else if (location.pathname.match(/^\/property\/\d+\/tenant\/new$/)) title = 'Tambah Penyewa'
    else if (location.pathname.match(/^\/tenant\/\d+\/edit$/)) title = 'Edit Penyewa'
    else if (location.pathname.match(/^\/tenant\/\d+$/)) title = 'Detail Penyewa'
    else title = 'Kontrakan'
  }

  return (
    <div className="flex min-h-svh flex-col bg-[var(--bg)]">
      <header className="sticky top-0 z-[100] flex h-[var(--navbar-height)] items-center border-b-[0.5px] border-[var(--separator)] bg-[var(--surface)] px-4">
        <div className="flex w-[60px] items-center">
          {hasBack && (
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[17px] text-[var(--accent)] active:opacity-50">
              <ChevronLeft className="size-5" />
              <span>Kembali</span>
            </button>
          )}
        </div>
        <span className="flex-1 text-center text-[17px] font-semibold text-[var(--fg)]">
          {title}
        </span>
        <div className="w-[60px]" />
      </header>

      <main className="flex-1 pb-[calc(var(--tab-bar)+var(--safe-bottom)+8px)]">
        <Outlet />
      </main>

      {showTabs && <BottomTabBar />}
    </div>
  )
}
