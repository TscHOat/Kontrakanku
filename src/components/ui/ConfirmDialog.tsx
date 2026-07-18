import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  destructive,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent showCloseButton={false} className="max-w-[300px] p-5">
        <DialogHeader>
          <DialogTitle className="text-center text-[17px]">{title}</DialogTitle>
          <DialogDescription className="text-center text-[13px] text-[var(--fg-secondary)]">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onConfirm}
            className={`w-full py-3 text-[15px] ${
              destructive ? 'bg-[var(--red)] hover:bg-[var(--red)]' : 'bg-[var(--green)] hover:bg-[var(--green)]'
            }`}
          >
            {confirmText}
          </Button>
          <DialogClose
            render={
              <Button variant="outline" className="w-full border-[var(--border)] py-3 text-[15px] text-[var(--accent)]" />
            }
          >
            {cancelText}
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
