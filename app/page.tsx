"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QuizFlow } from "@/components/quiz-flow"
import { UserDataForm } from "@/components/user-data-form" // Added user data form import
import Image from "next/image"

export default function HomePage() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false) // Added state for user form
  const [userData, setUserData] = useState<{ name: string; email: string; phone: string } | null>(null) // Added user data state

  const startQuiz = () => {
    setShowUserForm(true)
  }

  const handleUserDataSubmit = (data: { name: string; email: string; phone: string }) => {
    setUserData(data)
    setShowUserForm(false)
    setShowQuiz(true)
  }

  const returnToLanding = () => {
    setShowQuiz(false)
    setShowUserForm(false) // Also reset user form state
  }

  const returnFromUserForm = () => {
    setShowUserForm(false) // Return from user form to landing
  }

  if (showUserForm) {
    return <UserDataForm onSubmit={handleUserDataSubmit} onBack={returnFromUserForm} />
  }

  if (showQuiz) {
    return <QuizFlow onBack={returnToLanding} userData={userData} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex flex-col items-center justify-center p-4">
      {/* Animated Plants Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 text-6xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          🌱
        </div>
        <div
          className="absolute top-32 right-16 text-5xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        >
          🌿
        </div>
        <div
          className="absolute bottom-32 left-20 text-7xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        >
          🪴
        </div>
        <div
          className="absolute bottom-20 right-12 text-6xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        >
          🌳
        </div>
        <div
          className="absolute top-1/2 left-1/4 text-4xl animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3.8s" }}
        >
          🍃
        </div>
        <div
          className="absolute top-1/3 right-1/3 text-5xl animate-bounce"
          style={{ animationDelay: "2.5s", animationDuration: "3.2s" }}
        >
          🌺
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <Image src="/ekondo-logo.png" alt="Ekondo" width={200} height={60} className="h-12 w-auto mx-auto" />
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 text-balance">Find Your Soilmate</h1>
          <div className="text-8xl mb-6 animate-pulse">🌱</div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            The plant that grows with you. Discover your perfect green companion through our fun personality quiz.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={startQuiz}
          >
            Find Your Soilmate 🌿
          </Button>

          <Dialog open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-xl transition-all duration-300 bg-transparent"
              >
                How it works
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center text-primary">How it works</DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Three simple steps to find your perfect plant companion
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Answer</h3>
                    <p className="text-sm text-muted-foreground">Take our fun 5-question personality quiz</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Match</h3>
                    <p className="text-sm text-muted-foreground">Get matched with your perfect plant soilmate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Adopt</h3>
                    <p className="text-sm text-muted-foreground">Bring your new green friend home</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="font-semibold text-card-foreground mb-2">Personality Match</h3>
              <p className="text-sm text-muted-foreground">Plants that reflect your lifestyle and care preferences</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="font-semibold text-card-foreground mb-2">Growth Journey</h3>
              <p className="text-sm text-muted-foreground">Learn life lessons as you nurture your plant companion</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold text-card-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">Share your plant journey with fellow plant parents</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
