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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { membersApi } from "@/lib/api"
import type { Member } from "@/lib/types"
import { toast } from "sonner"

const memberSchema = z.object({
  associationId: z.string().min(1, "Association is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  joinDate: z.string().min(1, "Join date is required"),
  membershipType: z.enum(["regular", "honorary", "associate"]),
  status: z.enum(["active", "inactive", "suspended"]),
})

type MemberFormData = z.infer<typeof memberSchema>

interface MemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  onSuccess: () => void
}

export function MemberDialog({ open, onOpenChange, member, onSuccess }: MemberDialogProps) {
  const isEditing = !!member

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      associationId: "",
      name: "",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      membershipType: "regular",
      status: "active",
    },
  })

  useEffect(() => {
    if (member) {
      form.reset({
        associationId: member.associationId,
        name: member.name,
        email: member.email,
        phone: member.phone,
        joinDate: member.joinDate.split("T")[0],
        membershipType: member.membershipType,
        status: member.status,
      })
    } else {
      form.reset({
        associationId: "",
        name: "",
        email: "",
        phone: "",
        joinDate: new Date().toISOString().split("T")[0],
        membershipType: "regular",
        status: "active",
      })
    }
  }, [member, form])

  async function onSubmit(data: MemberFormData) {
    const response = isEditing ? await membersApi.update(member.id, data) : await membersApi.create(data)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success(isEditing ? "Member updated successfully" : "Member added successfully")
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the member details below." : "Fill in the details to add a new member."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="associationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Association ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter association ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="member@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="honorary">Honorary</SelectItem>
                        <SelectItem value="associate">Associate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
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
                      <SelectItem value="suspended">Suspended</SelectItem>
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
                {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
