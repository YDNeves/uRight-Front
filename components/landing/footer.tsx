"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-25 h-8 relative">
                <Image src="/logo.png" alt="uRight" width={32} height={32} className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-secondary-foreground/80 text-sm">Plataforma de gestão de associações</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <Link href="#features" className="hover:text-secondary-foreground transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-secondary-foreground transition-colors">
                  Planos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Segurança
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/70">© 2025 uRight. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
