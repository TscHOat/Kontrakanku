import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-[60px] text-center">
      <div className="mb-4 text-[56px]">🏠</div>
      <p className="mb-5 text-[15px] text-[var(--fg-secondary)]">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="h-auto px-6 py-3 text-[15px]">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
