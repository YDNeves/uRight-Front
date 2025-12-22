"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const { verifyEmail } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error")
        return
      }

      const result = await verifyEmail(token)
      if (result.success) {
        setStatus("success")
        toast({
          title: "Email verificado",
          description: "Sua conta foi ativada com sucesso",
        })
      } else {
        setStatus("error")
        toast({
          title: "Erro na verificação",
          description: result.error,
          variant: "destructive",
        })
      }
    }

    verify()
  }, [token, verifyEmail, toast])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">uRight</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Verificando email...</h2>
              <p className="text-sm text-muted-foreground">Aguarde um momento</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Email verificado!</h2>
              <p className="text-sm text-muted-foreground">Sua conta está pronta para uso</p>
              <Link href="/login">
                <Button className="w-full h-10 font-medium">Ir para login</Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Verificação falhou</h2>
              <p className="text-sm text-muted-foreground">O link pode ter expirado ou ser inválido</p>
              <Link href="/login">
                <Button className="w-full h-10 font-medium">Voltar ao login</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
