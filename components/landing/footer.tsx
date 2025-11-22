"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="uRight Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg">uRight</span>
            </div>
            <p className="text-secondary-foreground/80 text-sm">Sonhos e Realizações</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Segurança
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Termos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary-foreground smooth-transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-secondary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/70">© 2025 uRight. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground smooth-transition">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground smooth-transition">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground smooth-transition">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground smooth-transition">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
