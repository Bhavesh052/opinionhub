'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, BarChart3, Users, Zap, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="w-full flex flex-col gap-y-2 items-center justify-center">
                <img src="/logo.svg" alt="Logo" className="w-20 h-20 mb-2 object-contain" />
              </div>
              <span className="text-2xl font-bold text-foreground">OpinionHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  Browse Surveys
                </Link>
              </Button>
              <Button className="gap-2" asChild>
                <Link href="/dashboard/create">
                  <Plus className="w-4 h-4" />
                  Create Survey
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl">
                  Gather <span className="text-primary">Real Insights</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Create, distribute, and analyze surveys with Opinion Hub. Collect valuable feedback from your audience effortlessly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="gap-2 px-8"
                  asChild
                >
                  <Link href="/dashboard/create">
                    Start Creating
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/dashboard">
                    Browse Surveys
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Trusted by 10,000+ organizations
                </p>
                <div className="flex gap-4 flex-wrap">
                  {['TechCorp', 'Research Inc', 'Growth Co'].map((name) => (
                    <div key={name} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Features Preview */}
            <div className="grid gap-4">
              <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Real-time Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Get instant insights with live response tracking and detailed analytics.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Easy Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      Share surveys via link and collect responses from anywhere.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Flexible Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Support multiple question types: multiple choice, text, and more.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features for Every Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to create impactful surveys
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Drag & Drop Editor',
                description: 'Build surveys in minutes with our intuitive drag-and-drop interface.',
              },
              {
                title: 'Smart Logic',
                description: 'Create conditional paths based on responses to improve survey flow.',
              },
              {
                title: 'Collaboration',
                description: 'Invite team members to create and analyze surveys together.',
              },
              {
                title: 'Multiple Formats',
                description: 'Use single choice, multi-select, text, and more question types.',
              },
              {
                title: 'Custom Branding',
                description: 'Match your brand with customizable themes and colors.',
              },
              {
                title: 'Export & Integrate',
                description: 'Export results as CSV or integrate with your favorite tools.',
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ChevronRight className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Collect Better Feedback?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of organizations using Opinion Hub to gather insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 px-8"
              asChild
            >
              <Link href="/dashboard/create">
                Create Your First Survey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <Link href="/dashboard">
                Browse Available Surveys
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
