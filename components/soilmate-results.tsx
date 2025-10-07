"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { loadStoredUTM } from "@/lib/utm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2, ShoppingBag, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface Plant {
  id: string
  name: string
  emoji: string
  image: string // Added image property for actual plant photos
  personality: string
  careLevel: string
  lightNeeds: string
  description: string
}

const plants: Plant[] = [
  {
    id: "aglaonema",
    name: "Aglaonema",
    emoji: "🌿✨",
    image: "/beautiful-aglaonema-chinese-evergreen-plant-with-c.jpg",
    personality:
      "Your Soilmate is the perfect companion for busy lifestyles. With stunning variegated leaves, it teaches you that beauty comes in many forms. It thrives in low light and forgives forgotten waterings, reminding you that resilience is a quiet strength.",
    careLevel: "minimal",
    lightNeeds: "shady",
    description: "Colorful foliage that brightens any low-light space",
  },
  {
    id: "syngonium",
    name: "Syngonium",
    emoji: "🌱💚",
    image: "/syngonium-arrowhead-plant-with-heart-shaped-green-.jpg",
    personality:
      "Your Soilmate grows and changes with you, starting with simple heart-shaped leaves that transform into intricate patterns. It teaches you that growth is a journey, not a destination, and that adapting to change brings new beauty.",
    careLevel: "little",
    lightNeeds: "mixed",
    description: "An evolving beauty that changes as it grows",
  },
  {
    id: "spider-plant",
    name: "Spider Plant",
    emoji: "🕷️🌿",
    image: "/spider-plant-with-long-green-striped-leaves-and-ba.jpg",
    personality:
      "Your Soilmate is generous and giving, producing baby plants that you can share with others. It teaches you that abundance comes from nurturing relationships and that the best gifts are the ones that keep growing.",
    careLevel: "little",
    lightNeeds: "mixed",
    description: "A generous grower that loves to share its offspring",
  },
  {
    id: "baby-rubber-plant",
    name: "Baby Rubber Plant",
    emoji: "🌿🍃",
    image: "/baby-rubber-plant-with-thick-glossy-green-oval-lea.jpg",
    personality:
      "Your Soilmate has thick, glossy leaves that store water and wisdom. It teaches you patience and the value of steady growth. Like you, it's adaptable and resilient, thriving in various conditions while maintaining its elegant composure.",
    careLevel: "minimal",
    lightNeeds: "mixed",
    description: "Glossy leaves and easy-going nature for any space",
  },
  {
    id: "sansevieria",
    name: "Sansevieria",
    emoji: "🗡️🌱",
    image: "/sansevieria-snake-plant-with-tall-upright-sword-li.jpg",
    personality:
      "Your Soilmate stands tall and proud with sword-like leaves that purify the air around you. It teaches you about boundaries and self-care, showing that sometimes the strongest thing you can do is simply stand your ground and breathe clean.",
    careLevel: "minimal",
    lightNeeds: "mixed",
    description: "A strong, upright guardian that purifies your air",
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    emoji: "🐍🌿",
    image: "/snake-plant-with-tall-thick-green-leaves-with-yell.jpg",
    personality:
      "Your Soilmate is the ultimate survivor, thriving on neglect and low maintenance. It teaches you that consistency doesn't require perfection, and that sometimes the most beautiful growth happens when you learn to trust the process and let go.",
    careLevel: "minimal",
    lightNeeds: "mixed",
    description: "The ultimate low-maintenance companion for busy lives",
  },
]

interface SoilmateResultsProps {
  answers: Record<number, string>
  onRetakeQuiz: () => void
  onBack: () => void
  userData?: { name: string; email: string; phone: string } | null
}

export function SoilmateResults({ answers, onRetakeQuiz, onBack, userData }: SoilmateResultsProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const getMatchedPlant = (): Plant => {
    const lifestyle = answers[0] // busy, relaxed, adventurous
    const homeFrequency = answers[1] // daily, few-times, rarely
    const careLevel = answers[2] // minimal, little, love-it
    const spaceLight = answers[3] // sunny, shady, mixed
    const reminder = answers[4] // slow-down, gratitude, responsibility

    // Override: poor light or rarely available => Snake Plant/Sansevieria
    if (spaceLight === "shady" || homeFrequency === "rarely") {
      const snake = plants.find((p) => p.id === "snake-plant")
      if (snake) return snake
      const sansevieria = plants.find((p) => p.id === "sansevieria")
      if (sansevieria) return sansevieria
    }

    let matchedPlants = plants.filter((plant) => {
      const careMatch = plant.careLevel === careLevel
      const lightMatch = plant.lightNeeds === spaceLight || plant.lightNeeds === "mixed"
      return careMatch || lightMatch
    })

    if (matchedPlants.length === 0) {
      matchedPlants = plants.filter((plant) => plant.careLevel === careLevel)
    }

    if (matchedPlants.length === 0) {
      return plants[0] // Aglaonema as default
    }

    if (reminder === "slow-down" && matchedPlants.find((p) => p.id === "snake-plant")) {
      return plants.find((p) => p.id === "snake-plant")!
    }
    if (reminder === "responsibility" && matchedPlants.find((p) => p.id === "sansevieria")) {
      return plants.find((p) => p.id === "sansevieria")!
    }
    if (reminder === "gratitude" && matchedPlants.find((p) => p.id === "spider-plant")) {
      return plants.find((p) => p.id === "spider-plant")!
    }
    if (lifestyle === "busy" && matchedPlants.find((p) => p.id === "aglaonema")) {
      return plants.find((p) => p.id === "aglaonema")!
    }
    if (lifestyle === "adventurous" && matchedPlants.find((p) => p.id === "syngonium")) {
      return plants.find((p) => p.id === "syngonium")!
    }

    return matchedPlants[0]
  }

  const matchedPlant = getMatchedPlant()

  const utm = useMemo(() => loadStoredUTM(), [])

  const hasPostedMatchRef = useRef(false)
  useEffect(() => {
    // Fire GA4 event
    try {
      // @ts-ignore
      window.gtag?.("event", "soilmate_match", {
        plant_id: matchedPlant.id,
        plant_name: matchedPlant.name,
        care_level: matchedPlant.careLevel,
        light_needs: matchedPlant.lightNeeds,
        ...utm,
      })
    } catch {}

    // Send to Sheets webhook via API route
    if (hasPostedMatchRef.current) return
    hasPostedMatchRef.current = true
    console.log('📊 Sending match data to API:', {
      plant_id: matchedPlant.id,
      plant_name: matchedPlant.name,
      care_level: matchedPlant.careLevel,
      light_needs: matchedPlant.lightNeeds,
    })
    fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_id: matchedPlant.id,
        plant_name: matchedPlant.name,
        care_level: matchedPlant.careLevel,
        light_needs: matchedPlant.lightNeeds,
        answers,
        utm,
        page: typeof window !== "undefined" ? window.location.href : undefined,
      }),
      keepalive: true,
    }).then(response => {
      console.log('📊 API response:', response.status, response.ok)
      return response.json()
    }).then(data => {
      console.log('📊 API data:', data)
    }).catch(error => {
      console.error('📊 API error:', error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPlant.id])

  // Submit consolidated Google Form at the end with user info + soilmate
  const hasSubmittedFormRef = useRef(false)
  useEffect(() => {
    if (!userData) return
    if (hasSubmittedFormRef.current) return
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("entry.1992583615", userData.name)
      formDataToSend.append("entry.1431523734", userData.email)
      formDataToSend.append("entry.321670577", userData.phone)
      formDataToSend.append("entry.1278630449", matchedPlant.name)

      hasSubmittedFormRef.current = true
      fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLScRykTySMfWTyGS6QAyF3lHLBzUh7ZBYKLKCTaTo4-Sbgs9eA/formResponse",
        {
          method: "POST",
          body: formDataToSend,
          mode: "no-cors",
          keepalive: true,
        },
      ).catch(() => {})
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPlant.id])

  const handleShare = async () => {
    const shareData = {
      title: `🌱 Found my Soilmate!`,
      text: `Just discovered my perfect plant match: ${matchedPlant.name}! 🌿 Find yours too!`,
      url: window.location.origin,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // User cancelled or error occurred, fallback to clipboard
        handleFallbackShare(shareData)
      }
    } else {
      handleFallbackShare(shareData)
    }
  }

  const handleFallbackShare = (shareData: { title: string; text: string; url: string }) => {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
    navigator.clipboard.writeText(shareText).then(() => {
      setShareDialogOpen(true)
    })
  }

  const handleAdopt = () => {
    const plantUrlMap: Record<string, string> = {
      aglaonema: "https://ekondolife.com/product/aglaonema/",
      syngonium: "https://ekondolife.com/product/syngonium/",
      "spider-plant": "https://ekondolife.com/product/spider-plant/",
      "baby-rubber-plant": "https://ekondolife.com/product/baby-rubber-plant/",
      sansevieria: "https://ekondolife.com/product/sansevieria/",
      "snake-plant": "https://ekondolife.com/product/snake/",
    }

    const url = plantUrlMap[matchedPlant.id] || "https://ekondolife.com/"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className="absolute top-20 left-10 text-6xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        >
          🌱
        </div>
        <div
          className="absolute top-32 right-16 text-5xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        >
          🌿
        </div>
        <div
          className="absolute bottom-32 left-20 text-7xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4.5s" }}
        >
          🪴
        </div>
        <div
          className="absolute bottom-20 right-12 text-6xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "5.5s" }}
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

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center">
            <Image src="/ekondo-logo.png" alt="Ekondo" width={120} height={40} className="h-8 w-auto" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Meet Your Soilmate!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Based on your personality, we found your perfect plant companion
          </p>

          <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-2xl max-w-2xl mx-auto">
            <CardHeader className="text-center pb-6">
              <div className="mb-4 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={matchedPlant.image || "/placeholder.svg"}
                    alt={matchedPlant.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl text-card-foreground mb-2">{matchedPlant.name}</CardTitle>
              <p className="text-muted-foreground text-lg">{matchedPlant.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-6">
                <p className="text-card-foreground text-lg leading-relaxed text-pretty">{matchedPlant.personality}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleShare}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share my Soilmate
                </Button>

                <Button
                  onClick={handleAdopt}
                  variant="outline"
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-6 text-lg rounded-xl transition-all duration-300 bg-transparent"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Adopt my Soilmate
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={onRetakeQuiz}
                className="w-full text-muted-foreground hover:text-foreground py-4 text-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Take quiz again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Copied to Clipboard!</DialogTitle>
            <DialogDescription className="text-center">
              Your Soilmate details have been copied. You can now paste and share them on WhatsApp, Instagram, or any
              other app!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShareDialogOpen(false)}>Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
