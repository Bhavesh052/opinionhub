'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Check } from 'lucide-react'

interface SurveyTakerProps {
  surveyId: string
  onBack: () => void
}

// Mock survey data
const MOCK_SURVEY = {
  id: '1',
  title: 'Customer Satisfaction Survey',
  description: 'Help us improve by sharing your feedback on our products and services.',
  questions: [
    {
      id: 'q1',
      type: 'SINGLE_SELECT' as const,
      text: 'How satisfied are you with our service?',
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      required: true,
      order: 0,
    },
    {
      id: 'q2',
      type: 'MULTI_SELECT' as const,
      text: 'Which features do you use the most? (Select all that apply)',
      options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
      required: true,
      order: 1,
    },
    {
      id: 'q3',
      type: 'TEXT' as const,
      text: 'What is your primary use case?',
      required: false,
      order: 2,
    },
    {
      id: 'q4',
      type: 'LONG_TEXT' as const,
      text: 'Please share any additional feedback or suggestions',
      required: false,
      order: 3,
    },
  ],
}

export default function SurveyTaker({ surveyId, onBack }: SurveyTakerProps) {
  const survey = MOCK_SURVEY
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const question = survey.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / survey.questions.length) * 100

  const handleResponseChange = (value: any) => {
    setResponses((prev) => ({
      ...prev,
      [question.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Validate required fields
    const allAnswered = survey.questions
      .filter((q) => q.required)
      .every((q) => responses[q.id] !== undefined && responses[q.id] !== '')

    if (allAnswered) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your response has been recorded. We appreciate your feedback!
          </p>
          <Button onClick={onBack} className="w-full">
            Back to Surveys
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {survey.questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 bg-card mb-8">
          {currentQuestion === 0 && (
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-foreground mb-2">{survey.title}</h1>
              <p className="text-lg text-muted-foreground">{survey.description}</p>
            </div>
          )}

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {question.text}
              {question.required && (
                <span className="text-destructive ml-2">*</span>
              )}
            </h2>

            {/* Question Responses */}
            {question.type === 'SINGLE_SELECT' && (
              <div className="space-y-3">
                {question.options?.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`q${question.id}`}
                      value={option}
                      checked={responses[question.id] === option}
                      onChange={(e) => handleResponseChange(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-foreground font-medium">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'MULTI_SELECT' && (
              <div className="space-y-3">
                {question.options?.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(responses[question.id]) &&
                        responses[question.id].includes(option)
                      }
                      onChange={(e) => {
                        const currentAnswers = responses[question.id] || []
                        if (e.target.checked) {
                          handleResponseChange([...currentAnswers, option])
                        } else {
                          handleResponseChange(
                            currentAnswers.filter((a: string) => a !== option)
                          )
                        }
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-foreground font-medium">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'TEXT' && (
              <Input
                type="text"
                placeholder="Your answer..."
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
                className="text-base py-6"
              />
            )}

            {question.type === 'LONG_TEXT' && (
              <Textarea
                placeholder="Your answer..."
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
                rows={4}
                className="text-base"
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === survey.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="gap-2"
                disabled={
                  survey.questions
                    .filter((q) => q.required)
                    .some(
                      (q) =>
                        responses[q.id] === undefined ||
                        responses[q.id] === ''
                    )
                }
              >
                <Check className="w-4 h-4" />
                Submit Survey
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  question.required &&
                  (responses[question.id] === undefined ||
                    responses[question.id] === '')
                }
              >
                Next
              </Button>
            )}
          </div>
        </Card>

        {/* Question Indicators */}
        <div className="flex flex-wrap gap-2 justify-center">
          {survey.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(i)}
              className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                i === currentQuestion
                  ? 'bg-primary text-primary-foreground'
                  : i < currentQuestion
                    ? 'bg-primary/30 text-primary'
                    : 'bg-border text-muted-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
