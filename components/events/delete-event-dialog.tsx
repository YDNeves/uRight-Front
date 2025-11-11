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
import { eventsApi } from "@/lib/api"
import type { Event } from "@/lib/types"
import { toast } from "sonner"

interface DeleteEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  onSuccess: () => void
}

export function DeleteEventDialog({ open, onOpenChange, event, onSuccess }: DeleteEventDialogProps) {
  async function handleDelete() {
    if (!event) return

    const response = await eventsApi.delete(event.id)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Event deleted successfully")
      onSuccess()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the event "{event?.title}". This action cannot be undone.
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
