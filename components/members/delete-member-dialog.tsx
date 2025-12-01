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
import { membersApi } from "@/lib/api"
import type { Member } from "@/lib/types"
import { toast } from "sonner"

interface DeleteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  onSuccess: () => void
}

export function DeleteMemberDialog({ open, onOpenChange, member, onSuccess }: DeleteMemberDialogProps) {
  async function handleDelete() {
    if (!member) return

    const response = await membersApi.delete(member.id)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Member deleted successfully")
      onSuccess()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the member "{member?.name}". This action cannot be undone.
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
