"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SoilmateResults } from "@/components/soilmate-results"

interface QuizAnswer {
  id: string
  text: string
  emoji: string
  value: string
}

interface QuizQuestion {
  id: number
  question: string
  answers: QuizAnswer[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your lifestyle like?",
    answers: [
      { id: "busy", text: "Busy", emoji: "🏃", value: "busy" },
      { id: "relaxed", text: "Relaxed", emoji: "🛋️", value: "relaxed" },
      { id: "adventurous", text: "Adventurous", emoji: "🌍", value: "adventurous" },
    ],
  },
  {
    id: 2,
    question: "How often are you home?",
    answers: [
      { id: "daily", text: "Daily", emoji: "🏠", value: "daily" },
      { id: "few-times", text: "Few times a week", emoji: "🚗", value: "few-times" },
      { id: "rarely", text: "Rarely", emoji: "✈️", value: "rarely" },
    ],
  },
  {
    id: 3,
    question: "How much care are you ready for?",
    answers: [
      { id: "minimal", text: "Minimal", emoji: "💤", value: "minimal" },
      { id: "little", text: "A little", emoji: "🪴", value: "little" },
      { id: "love-it", text: "I love it", emoji: "❤️", value: "love-it" },
    ],
  },
  {
    id: 4,
    question: "What's your space like?",
    answers: [
      { id: "sunny", text: "Sunny", emoji: "🌞", value: "sunny" },
      { id: "shady", text: "Shady", emoji: "🌙", value: "shady" },
      { id: "mixed", text: "Mixed", emoji: "⛅", value: "mixed" },
    ],
  },
  {
    id: 5,
    question: "What do you want your plant to remind you of?",
    answers: [
      { id: "slow-down", text: "Slow down", emoji: "⏳", value: "slow-down" },
      { id: "gratitude", text: "Gratitude", emoji: "🙏", value: "gratitude" },
      { id: "responsibility", text: "Responsibility", emoji: "🤲", value: "responsibility" },
    ],
  },
]

interface QuizFlowProps {
  onBack: () => void
}

export function QuizFlow({ onBack }: QuizFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResults, setShowResults] = useState(false)

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
  }

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = { ...answers, [currentQuestion]: selectedAnswer }
      setAnswers(newAnswers)

      if (isLastQuestion) {
        setShowResults(true)
      } else {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || "")
    }
  }

  const handleRetakeQuiz = () => {
    setShowResults(false)
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedAnswer("")
  }

  if (showResults) {
    return <SoilmateResults answers={answers} onRetakeQuiz={handleRetakeQuiz} onBack={onBack} />
  }

  const currentQuestionData = quizQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex flex-col items-center justify-center p-4">
      {/* Animated Plants Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div
          className="absolute top-20 left-10 text-4xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        >
          🌱
        </div>
        <div
          className="absolute top-32 right-16 text-3xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        >
          🌿
        </div>
        <div
          className="absolute bottom-32 left-20 text-5xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4.5s" }}
        >
          🪴
        </div>
        <div
          className="absolute bottom-20 right-12 text-4xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "5.5s" }}
        >
          🌳
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl md:text-3xl text-balance text-card-foreground">
              {currentQuestionData.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestionData.answers.map((answer) => (
              <Card
                key={answer.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedAnswer === answer.id
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                    : "bg-card hover:bg-muted/50 border-border"
                }`}
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <CardContent className="flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <div className="text-4xl">{answer.emoji}</div>
                    <div className="text-lg font-medium">{answer.text}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLastQuestion ? "Finish Quiz" : "Next"}
            {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
