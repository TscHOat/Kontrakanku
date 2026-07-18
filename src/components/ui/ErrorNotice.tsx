import { Button } from '@/components/ui/button'

interface ErrorNoticeProps {
  message: string
  onRetry?: () => void
}

export default function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  return (
    <div className="mx-4 mt-4 rounded-lg border p-4 text-sm"
      style={{ borderColor: 'var(--red)', background: 'var(--red-bg)', color: 'var(--red-text)' }}>
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost" className="mt-2 h-auto p-0 text-sm font-medium text-[var(--red-text)] underline hover:bg-transparent">
          Coba lagi
        </Button>
      )}
    </div>
  )
}
