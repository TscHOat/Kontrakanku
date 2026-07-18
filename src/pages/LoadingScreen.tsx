export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--surface)]">
      <div className="text-center">
        <div className="mb-4 text-[40px]">🏠</div>
        <p className="text-[15px] text-[var(--fg-secondary)]">Memuat...</p>
      </div>
    </div>
  )
}
