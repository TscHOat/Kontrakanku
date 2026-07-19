import { resetDB } from '@/db'
import { downloadFile, exportJSON, exportSQLite } from '@/lib/export'
import { importJSON, importSQLite, readFileAsArrayBuffer, readFileAsText } from '@/lib/import'
import { useRef, useState } from 'react'

const rowClass = "w-full flex items-center gap-3 bg-[var(--surface)] px-4 py-[14px] text-[16px] text-[var(--fg)] active:opacity-70"
const rowBorder = "border-b border-[var(--separator)] last:border-b-0"

export default function SettingsPage() {
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const sqliteInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<'json-export' | 'sqlite-export' | 'json-import' | 'sqlite-import' | null>(null)
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showNotif = (type: 'success' | 'error', text: string) => {
    setNotif({ type, text })
    setTimeout(() => setNotif(null), 4000)
  }

  const handleExportJSON = async () => {
    setLoading('json-export')
    try {
      const data = await exportJSON()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      downloadFile(blob, `kontrakanku-${new Date().toISOString().slice(0, 10)}.json`)
      showNotif('success', 'Export JSON berhasil')
    } catch (e) {
      showNotif('error', `Gagal export: ${(e as Error).message}`)
    } finally {
      setLoading(null)
    }
  }

  const handleExportSQLite = async () => {
    setLoading('sqlite-export')
    try {
      const data = exportSQLite()
      downloadFile(data, `kontrakanku-${new Date().toISOString().slice(0, 10)}.sqlite`)
      showNotif('success', 'Export .sqlite berhasil')
    } catch (e) {
      showNotif('error', `Gagal export: ${(e as Error).message}`)
    } finally {
      setLoading(null)
    }
  }

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading('json-import')
    try {
      const text = await readFileAsText(file)
      const data = JSON.parse(text)
      const result = await importJSON(data)
      showNotif('success', `Import berhasil: ${result.properties} properti, ${result.tenants} penyewa, ${result.payments} bayar, ${result.maintenances} perbaikan`)
    } catch (e) {
      showNotif('error', `Gagal import: ${(e as Error).message}`)
    } finally {
      setLoading(null)
      if (jsonInputRef.current) jsonInputRef.current.value = ''
    }
  }

  const handleImportSQLite = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading('sqlite-import')
    try {
      const buf = await readFileAsArrayBuffer(file)
      await importSQLite(new Uint8Array(buf))
      showNotif('success', 'Import .sqlite berhasil. Muat ulang halaman.')
    } catch (e) {
      showNotif('error', `Gagal import: ${(e as Error).message}`)
    } finally {
      setLoading(null)
      if (sqliteInputRef.current) sqliteInputRef.current.value = ''
    }
  }

  const Spinner = () => <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

  const GroupedList = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="px-4 pb-4">
      <div className="section-head">{title}</div>
      <div className="overflow-hidden rounded-[10px] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </div>
  )

  const RowBtn = ({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) => (
    <button onClick={onClick} disabled={disabled} className={`${rowClass} ${rowBorder} ${disabled ? 'opacity-40' : ''}`}>
      {children}
    </button>
  )

  return (
    <div>
      {/* iOS data loss warning */}
      <div className="px-4 pb-2">
        <div className="rounded-[10px] bg-[var(--orange)]/10 border border-[var(--orange)]/30 px-4 py-3 text-[13px] text-[var(--orange)]">
          ⚠️ <strong>iOS note:</strong> Safari hapus data PWA jika 7 hari tidak dibuka.
          Backup rutin untuk amankan data.
        </div>
      </div>

      <GroupedList title="Data">
        <RowBtn onClick={() => { setLoading('json-export'); handleExportJSON() }} disabled={loading !== null}>
          {loading === 'json-export' ? <Spinner /> : '📤'} Export JSON
        </RowBtn>
        <RowBtn onClick={() => { setLoading('sqlite-export'); handleExportSQLite() }} disabled={loading !== null}>
          {loading === 'sqlite-export' ? <Spinner /> : '📤'} Export .sqlite
        </RowBtn>
        <RowBtn onClick={() => jsonInputRef.current?.click()} disabled={loading !== null}>
          {loading === 'json-import' ? <Spinner /> : '📥'} Import JSON
        </RowBtn>
        <RowBtn onClick={() => sqliteInputRef.current?.click()} disabled={loading !== null}>
          {loading === 'sqlite-import' ? <Spinner /> : '📥'} Import .sqlite
        </RowBtn>
      </GroupedList>

      <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
      <input ref={sqliteInputRef} type="file" accept=".sqlite,.db" className="hidden" onChange={handleImportSQLite} />

      {/* Toast notification */}
      {notif && (
        <div className="fixed bottom-24 left-4 right-4 z-[200] flex justify-center pointer-events-none">
          <div
            className={`rounded-[10px] px-5 py-3 text-[15px] font-medium shadow-lg pointer-events-auto ${
              notif.type === 'success' ? 'bg-[var(--green)] text-white' : 'bg-[var(--red)] text-white'
            }`}
          >
            {notif.text}
          </div>
        </div>
      )}

      <GroupedList title="Bahaya">
        <RowBtn onClick={async () => {
          if (!window.confirm('Hapus semua data? Tidak bisa dikembalikan.')) return
          await resetDB()
          window.location.reload()
        }}>
          🗑 Reset Semua Data
        </RowBtn>
      </GroupedList>
    </div>
  )
}
