"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { paymentsApi } from "@/lib/api"
import type { Payment } from "@/lib/types"
import { toast } from "sonner"

interface DeletePaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  onSuccess: () => void
}

export function DeletePaymentDialog({ open, onOpenChange, payment, onSuccess }: DeletePaymentDialogProps) {
  async function handleDelete() {
    if (!payment) return

    const response = await paymentsApi.delete(payment.id)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Payment deleted successfully")
      onSuccess()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the payment record for "${payment?.amount.toLocaleString()}". This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
