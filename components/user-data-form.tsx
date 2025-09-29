"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface UserDataFormProps {
  onSubmit: (userData: { name: string; email: string; phone: string }) => void
  onBack: () => void
}

export function UserDataForm({ onSubmit, onBack }: UserDataFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("entry.1992583615", formData.name)
      formDataToSend.append("entry.1431523734", formData.email)
      formDataToSend.append("entry.321670577", formData.phone)

      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLScRykTySMfWTyGS6QAyF3lHLBzUh7ZBYKLKCTaTo4-Sbgs9eA/formResponse",
        {
          method: "POST",
          body: formDataToSend,
          mode: "no-cors",
        },
      )

      onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      // Continue anyway since Google Forms submission might work even if we get an error
      onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.phone.trim()

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

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Form Card */}
        <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl md:text-3xl text-balance text-card-foreground">
              Let's get to know you! 🌱
            </CardTitle>
            <p className="text-muted-foreground">Help us personalize your plant journey</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-card-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Starting Quiz..." : "Start Quiz"}
                {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
