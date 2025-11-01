"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bus, Users, Shield, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[length:32px_32px]" />

      <div className="relative">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div
            className={`text-center transition-all duration-1000 transform ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Logo/Icon */}
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-3xl shadow-2xl">
                  <Bus className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 animate-gradient">
              מסיעי סמי ומשה
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto font-light">
              מערכת ניהול מתקדמת להסעות ילדים עם צרכים מיוחדים
            </p>

            <p className="text-slate-400 mb-12 max-w-xl mx-auto">
              ניהול חכם ויעיל של מערך ההסעות - מעקב אחר ילדים, נהגים, מלווים ומוסדות במקום אחד
            </p>

            {/* CTA Button */}
            <Link href="/dashboard">
              <Button
                size="lg"
                className="group text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                כניסה למערכת
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div
            className={`mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 transition-all duration-1000 delay-300 transform ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ניהול מרכזי</h3>
              <p className="text-slate-300 text-sm">
                מעקב אחר ילדים, הורים, נהגים ומלווים במקום אחד
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="bg-cyan-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-cyan-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">בטיחות מלאה</h3>
              <p className="text-slate-300 text-sm">
                מערכת מאובטחת עם גיבוי בזמן אמת לכל המידע
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">יעילות מקסימלית</h3>
              <p className="text-slate-300 text-sm">
                ממשק נוח וקל לשימוש עם חיפוש וסינון מתקדם
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        .bg-grid-slate-700\/\[0\.05\] {
          background-image: linear-gradient(to right, rgb(51 65 85 / 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(51 65 85 / 0.05) 1px, transparent 1px);
        }
      `}</style>
    </main>
  )
}
