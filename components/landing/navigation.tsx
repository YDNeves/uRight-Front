"use client"

import Link from "next/link"
import Image from "next/image"
// Importamos o useAuth para acessar o estado de login
import { useAuth } from "@/lib/auth-context" 
// Importamos os ícones necessários
import { User, LogOut, Loader2 } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { NAVIGATION_LINKS } from "@/lib/constants"

export function Navigation() {
  // Acessa o estado e as funções do contexto de autenticação
  const { user, loading, logout } = useAuth()
  
  // Define a URL do avatar. Assumimos que 'user' tem uma propriedade 'avatarUrl' ou 'name'
  const userAvatarUrl = user?.imageUrl || `https://placehold.co/100x100/A0A0A0/FFFFFF?text=${user?.name?.charAt(0) || 'U'}`;


  // --- Renderização Condicional da Autenticação ---
  let authContent;

  if (loading) {
    // 1. Estado de Carregamento: Mostra um spinner enquanto verifica o token
    authContent = (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  } else if (user) {
    // 2. Usuário Logado: Mostra avatar/ícone e botão de Logout
    authContent = (
      <>
        {/* Link para o perfil ou dashboard do usuário */}
        <Link href="/dashboard" aria-label="Perfil do Usuário" className="flex items-center gap-2"> 
          {/* Implementação do Avatar/Ícone do Usuário */}
          <div className="w-8 h-8 relative rounded-full overflow-hidden border border-primary/50 transition-shadow hover:shadow-md hover:shadow-primary/30">
            {/* Se o seu objeto 'user' tiver uma propriedade 'avatarUrl', use-a */}
            {user?.imageUrl ? (
                <Image
                    src={userAvatarUrl} 
                    alt={user.name || "User Profile"}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </div>
            )}
          </div>
        </Link>
        
        {/* Botão de Logout */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={logout} 
          title="Sair da Conta"
          className="text-muted-foreground hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </>
    );
  } else {
    // 3. Não Logado: Mostra botões Entrar e Registrar (o estado original)
    authContent = (
      <>
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Entrar
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Registar
          </Button>
        </Link>
      </>
    );
  }


  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {/* Logo Section */}
            <div className="w-25 h-10 relative"> 
              <Image 
                src="/logo.png" 
                alt="uRight" 
                fill 
                className="object-contain"
                sizes="(max-width: 100px) 10vw, 5vw"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Authentication Content (Conditional) */}
          <div className="flex items-center gap-3">
            {authContent}
          </div>
        </div>
      </div>
    </nav>
  )
}