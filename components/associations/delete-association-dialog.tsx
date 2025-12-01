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
import { associationsApi } from "@/lib/api"
import type { Association } from "@/lib/types"
import { toast } from "sonner"

interface DeleteAssociationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  association: Association | null
  onSuccess: () => void
}

export function DeleteAssociationDialog({ open, onOpenChange, association, onSuccess }: DeleteAssociationDialogProps) {
  async function handleDelete() {
    if (!association) return

    const response = await associationsApi.delete(association.id)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Association deleted successfully")
      onSuccess()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the association "{association?.name}". This action cannot be undone.
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
