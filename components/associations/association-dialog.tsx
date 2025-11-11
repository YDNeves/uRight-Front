"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { associationsApi } from "@/lib/api"
import type { Association } from "@/lib/types"
import { toast } from "sonner"

const associationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["cooperative", "association", "union"]),
  foundedDate: z.string().min(1, "Founded date is required"),
  status: z.enum(["active", "inactive"]),
})

type AssociationFormData = z.infer<typeof associationSchema>

interface AssociationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  association: Association | null
  onSuccess: () => void
}

export function AssociationDialog({ open, onOpenChange, association, onSuccess }: AssociationDialogProps) {
  const isEditing = !!association

  const form = useForm<AssociationFormData>({
    resolver: zodResolver(associationSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "association",
      foundedDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
  })

  useEffect(() => {
    if (association) {
      form.reset({
        name: association.name,
        description: association.description,
        type: association.type,
        foundedDate: association.foundedDate.split("T")[0],
        status: association.status,
      })
    } else {
      form.reset({
        name: "",
        description: "",
        type: "association",
        foundedDate: new Date().toISOString().split("T")[0],
        status: "active",
      })
    }
  }, [association, form])

  async function onSubmit(data: AssociationFormData) {
    const response = isEditing ? await associationsApi.update(association.id, data) : await associationsApi.create(data)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success(isEditing ? "Association updated successfully" : "Association created successfully")
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Association" : "Create New Association"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the association details below." : "Fill in the details to create a new association."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter association name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter association description" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                        <SelectItem value="association">Association</SelectItem>
                        <SelectItem value="union">Union</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
