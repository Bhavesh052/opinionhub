'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, BarChart3, Users, Clock } from 'lucide-react'

interface Survey {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED'
  questionCount: number
  responseCount: number
  createdAt: string
}

// Mock data
const MOCK_SURVEYS: Survey[] = [
  {
    id: '1',
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve by sharing your feedback on our products and services.',
    status: 'ACTIVE',
    questionCount: 10,
    responseCount: 245,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Product Roadmap Feedback',
    description: 'What features would you like to see in our next release?',
    status: 'ACTIVE',
    questionCount: 8,
    responseCount: 128,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Employee Engagement Study',
    description: 'Anonymous survey about workplace satisfaction and culture.',
    status: 'ACTIVE',
    questionCount: 15,
    responseCount: 89,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Market Research 2024',
    description: 'Understanding consumer trends and preferences in our industry.',
    status: 'COMPLETED',
    questionCount: 20,
    responseCount: 512,
    createdAt: '2023-12-20',
  },
  {
    id: '5',
    title: 'UX Research - New Dashboard',
    description: 'Gathering feedback on our redesigned dashboard interface.',
    status: 'ACTIVE',
    questionCount: 12,
    responseCount: 67,
    createdAt: '2024-01-12',
  },
]

interface SurveyListProps {
  onSelectSurvey: (surveyId: string) => void
  onBack: () => void
}

export default function SurveyList({ onSelectSurvey, onBack }: SurveyListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETE'>('ALL')

  const filteredSurveys = MOCK_SURVEYS.filter((survey) => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || survey.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Browse Surveys</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'COMPLETED'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status as any)}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredSurveys.length === 0 ? (
            <Card className="p-12 text-center bg-card">
              <p className="text-muted-foreground">No surveys found matching your criteria.</p>
            </Card>
          ) : (
            filteredSurveys.map((survey) => (
              <Card
                key={survey.id}
                className="p-6 bg-card hover:shadow-lg transition-all cursor-pointer border border-border"
                onClick={() => onSelectSurvey(survey.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{survey.title}</h3>
                      <Badge className={`${getStatusColor(survey.status)}`}>
                        {survey.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{survey.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>{survey.questionCount} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{survey.responseCount} responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{survey.createdAt}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSurvey(survey.id)
                    }}
                  >
                    Take Survey
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
