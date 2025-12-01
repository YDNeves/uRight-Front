import { Spinner } from "@/components/ui/spinner"

export default function LoadingCommunications() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Spinner className="h-8 w-8" />
    </div>
  )
}
