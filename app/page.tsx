'use client'

import Link from 'next/link'
import { ArrowRight, Users, BarChart3, Bell, Lock, Zap, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-foreground">URight</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition">Recursos</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition">Benefícios</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">Sobre</a>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-secondary text-primary-foreground">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Plataforma completa de gestão
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Gestão moderna para <span className="text-primary">associações</span> e ordens
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Centralize operações, simplifique pagamentos e fortaleça relacionamentos. Tudo num ambiente seguro, intuitivo e adaptado à realidade local.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <Button className="bg-primary hover:bg-secondary text-primary-foreground text-lg px-8 py-6 h-auto rounded-lg">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary/10 text-lg px-8 py-6 h-auto rounded-lg">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Associações Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Membros Gerenciados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Disponibilidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Suporte Técnico</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16">
            Recursos Poderosos
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Gestão de Membros',
                description: 'Cadastro completo, atualização de dados e classificação automática de membros.'
              },
              {
                icon: BarChart3,
                title: 'Controle Financeiro',
                description: 'Pagamentos integrados, relatórios e painel financeiro em tempo real.'
              },
              {
                icon: Bell,
                title: 'Notificações Inteligentes',
                description: 'Alertas automáticos por email, SMS e WhatsApp para renovações e atualizações.'
              },
              {
                icon: Lock,
                title: 'Segurança Total',
                description: 'Encriptação completa, controle de acesso por perfis e backups automáticos.'
              },
              {
                icon: Zap,
                title: 'Performance',
                description: 'Funciona fluido mesmo com conectividade reduzida. Otimizado para eficiência.'
              },
              {
                icon: CheckCircle,
                title: 'Escalável',
                description: 'Cresce com sua organização. Suporta desde pequenas associações até grandes redes.'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition group">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16">
            Por que escolher URight?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  'Reduz custos operacionais em até 60%',
                  'Aumenta transparência e confiança',
                  'Simplifica processo de pagamentos',
                  'Oferece suporte local em português',
                  'Integra Multicaixa Express e TPA',
                  'Certificados digitais automáticos'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-lg text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 rounded-lg p-8 md:p-12">
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <p className="font-semibold text-foreground mb-2">Caso de Sucesso:</p>
                  <p>"Com URight, conseguimos reduzir o tempo de gestão de membros em 70% e aumentar o engajamento significativamente."</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  — João Silva, Presidente de Associação
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Pronto para transformar sua associação?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comece a usar URight hoje gratuitamente. Sem cartão de crédito necessário.
          </p>
          <Link href="/register">
            <Button className="bg-primary hover:bg-secondary text-primary-foreground text-lg px-8 py-6 h-auto rounded-lg">
              Começar Agora Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">U</span>
                </div>
                <span className="text-lg font-bold text-foreground">URight</span>
              </div>
              <p className="text-muted-foreground text-sm">Gestão moderna para associações.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-foreground transition">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground transition">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-foreground transition">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-foreground transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition">Termos</a></li>
                <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <p className="text-center text-muted-foreground text-sm">
              © 2025 URight. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
