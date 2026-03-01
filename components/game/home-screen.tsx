"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { BookOpen } from "lucide-react"
import { STAT_CONFIG } from "@/lib/game-data"
import { getNicknameCache, setNicknameCache, getSave, getHistory, NICKNAME_MAX_LEN } from "@/lib/storage"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type HomeAction = "new" | "continue" | "history"

const RULES_CONTENT = [
  "在 7 天内，每天会经历多个饮食相关事件，你需要为角色做出选择。",
  "每个选择都会影响四项数值：血糖、心情、精力、饱腹。它们保持在 0～100 之间。",
  "血糖超过 100 或低于 10、精力或心情归零时，游戏结束。",
  "尽量做出健康、平衡的选择，活过 7 天即可通关；通关表现会根据血糖峰值等获得不同评级。",
]

interface HomeScreenProps {
  defaultNickname?: string
  onAction: (action: HomeAction, nickname: string) => void
}

export function HomeScreen({ defaultNickname = "", onAction }: HomeScreenProps) {
  const [nickname, setNickname] = useState("")
  const [pressed, setPressed] = useState<string | null>(null)
  const [hasSave, setHasSave] = useState(false)
  const [hasHistory, setHasHistory] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [showNicknameError, setShowNicknameError] = useState(false)
  const errorClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setNickname(defaultNickname || getNicknameCache())
  }, [defaultNickname])

  useEffect(() => {
    const t = nickname.trim().slice(0, NICKNAME_MAX_LEN)
    if (t.length === 0) {
      setHasSave(false)
      setHasHistory(false)
      return
    }
    setHasSave(getSave(t) != null)
    setHasHistory(getHistory(t).length > 0)
  }, [nickname])

  const trimmed = nickname.trim().slice(0, NICKNAME_MAX_LEN)
  const valid = trimmed.length > 0
  const displayName = trimmed || "小糖"

  const handleSubmit = (action: HomeAction) => {
    if (action === "history") {
      const name = trimmed || getNicknameCache()
      if (name) {
        setNicknameCache(name)
        onAction(action, name)
      }
      return
    }
    if (!valid) return
    setNicknameCache(trimmed)
    onAction(action, trimmed)
  }

  const handleStartClick = () => {
    if (!valid) {
      setShowNicknameError(true)
      if (errorClearRef.current) clearTimeout(errorClearRef.current)
      errorClearRef.current = setTimeout(() => setShowNicknameError(false), 1500)
      return
    }
    handleSubmit("new")
  }

  return (
    <div className="h-svh max-h-[100dvh] flex flex-col paper-bg relative overflow-auto pt-safe pb-safe">
      {/* 右上角规则入口 - 独立一行，不压盖主内容 */}
      <div className="shrink-0 flex justify-end w-full px-4 pt-3 pb-1">
        <button
          type="button"
          onClick={() => setRulesOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-[1.5px] border-slate-800 shadow-[2px_2px_0px_0px_#1e293b] bg-white text-slate-700 text-xs font-bold hover:opacity-90 transition-opacity"
          aria-label="活动规则"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {"规则"}
        </button>
      </div>

      <Sheet open={rulesOpen} onOpenChange={setRulesOpen}>
        <SheetContent side="right" className="paper-bg border-slate-800 border-l-2">
          <SheetHeader>
            <SheetTitle className="text-slate-800 font-black">活动规则说明</SheetTitle>
          </SheetHeader>
          <div className="px-1 space-y-3 text-sm text-slate-600 leading-relaxed">
            {RULES_CONTENT.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* 主内容：上下等距留白，元素间距统一，避免压盖 */}
      <div className="flex-1 flex flex-col items-center w-full px-4 pt-4 pb-8 sm:pt-6 sm:pb-10 min-h-0">
        {/* 上留白区（与底部 pb 对称） */}
        <div className="shrink-0 h-2 sm:h-4" aria-hidden />

        {/* Main hero - 尺寸适中，与下方元素留足间距 */}
        <div className="shrink-0 relative mt-0">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-xl sm:rounded-2xl border-[2.5px] border-slate-800 shadow-[4px_4px_0px_0px_#1e293b] overflow-hidden bg-white animate-bounce-pop">
            <Image
              src="/images/s-start.jpg"
              alt={`${displayName} - 控糖生存指南主角`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 144px, 208px"
            />
          </div>
          <div className="absolute -top-1 -right-1 bg-[#f5c542] border-2 border-slate-800 shadow-[1.5px_1.5px_0px_0px_#1e293b] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs animate-wiggle">
            {"!"}
          </div>
          <div className="absolute -bottom-1 -left-1 bg-[#5a9a6e] border-2 border-slate-800 shadow-[1.5px_1.5px_0px_0px_#1e293b] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] text-white font-bold">
            {"GO"}
          </div>
        </div>

        {/* Title - 与插画留出间距 */}
        <div className="shrink-0 mt-4 sm:mt-5 flex flex-col items-center gap-0.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 leading-tight text-center">
            {"控糖生存指南"}
          </h1>
          <div className="flex items-center gap-1">
            <div className="h-[2px] w-5 rounded-full bg-[#e05a5a]" />
            <div className="h-[2px] w-5 rounded-full bg-[#f5c542]" />
            <div className="h-[2px] w-5 rounded-full bg-[#5a9a6e]" />
            <div className="h-[2px] w-5 rounded-full bg-[#e8824a]" />
          </div>
        </div>

        {/* 气泡 - 与标题、下方区块留足间距 */}
        <div className="shrink-0 mt-4 sm:mt-5 w-full max-w-sm">
          <div className="speech-bubble px-3 py-2.5 sm:py-3">
            <p className="text-xs sm:text-sm text-slate-600 text-center leading-snug flex flex-wrap items-center justify-center gap-0.5">
              {"我是 "}
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value.slice(0, NICKNAME_MAX_LEN))
                  setShowNicknameError(false)
                }}
                placeholder="小糖"
                maxLength={NICKNAME_MAX_LEN}
                className={cn(
                  "inline-block w-[4.5em] min-w-[3em] max-w-[6em] text-center font-black text-slate-800 placeholder:text-slate-400 bg-transparent border-b-2 border-dashed border-slate-400 focus:border-[#5a9a6e] focus:outline-none py-0",
                  showNicknameError && "animate-input-shake border-[#e05a5a]"
                )}
              />
            </p>
            <p className="text-xs sm:text-sm text-slate-600 text-center leading-snug mt-1">
              {"我要做出正确饮食选择，健康生活七天？"}
            </p>
          </div>
          {showNicknameError && (
            <p className="mt-2 text-[10px] sm:text-xs text-[#e05a5a] font-bold text-center">
              {"请先填写你的昵称再开始游戏"}
            </p>
          )}
        </div>

        {/* 四维数值 - 与气泡、按钮留足间距 */}
        <div className="shrink-0 mt-4 sm:mt-5 w-full max-w-xs">
          <p className="text-[10px] sm:text-xs text-slate-500 text-center mb-2">
            {"游戏里，你的每个选择都会影响下面四项数值"}
          </p>
          <div className="grid grid-cols-2 gap-1.5 rounded-lg border-[1.5px] border-slate-800/30 bg-slate-50/50 p-2">
            {STAT_CONFIG.map((s) => (
              <div
                key={s.key}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border-[1.5px] border-slate-800 shadow-[1px_1px_0px_0px_#1e293b] text-[10px] sm:text-[9px] font-bold text-slate-700"
                style={{ backgroundColor: s.bg }}
              >
                <span className="text-xs">{s.emoji}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons - 与数值区、底部提示留足间距 */}
        <div className="shrink-0 mt-4 sm:mt-5 flex flex-col gap-2 w-full max-w-[280px]">
          {hasSave && (
            <button
              onClick={() => handleSubmit("continue")}
              onPointerDown={() => setPressed("continue")}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              className={`w-full py-2.5 rounded-xl border-2 border-slate-800 text-sm font-black transition-all duration-100 ${
                pressed === "continue" ? "translate-x-1 translate-y-1 shadow-[0px_0px_0px_0px_#1e293b]" : "shadow-[3px_3px_0px_0px_#1e293b]"
              } bg-[#5a9a6e] text-white`}
            >
              {"继续游戏"}
            </button>
          )}
          <button
            onClick={handleStartClick}
            onPointerDown={() => setPressed("new")}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
            className={`w-full py-3 rounded-xl border-[2.5px] border-slate-800 text-base sm:text-lg font-black transition-all duration-100 hover:brightness-105 ${
              pressed === "new" ? "translate-x-1 translate-y-1 shadow-[0px_0px_0px_0px_#1e293b]" : "shadow-[4px_4px_0px_0px_#1e293b]"
            } bg-[#5a9a6e] text-white`}
          >
            {hasSave ? "重新开始" : "开始冒险!"}
          </button>
          {hasHistory && (
            <button
              onClick={() => handleSubmit("history")}
              onPointerDown={() => setPressed("history")}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              className={`w-full py-2 rounded-lg border-2 border-slate-800 text-xs font-black transition-all ${
                pressed === "history" ? "translate-x-1 translate-y-1 shadow-none" : "shadow-[2px_2px_0px_0px_#1e293b]"
              } bg-white text-slate-700`}
            >
              {"参与历史与复盘"}
            </button>
          )}
        </div>

        {/* Swipe hint - 底部留白与顶部对称 */}
        <p className="shrink-0 mt-4 sm:mt-5 text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <span className="animate-wiggle">{"<"}</span>
          {" 滑动卡片做选择 "}
          <span className="animate-wiggle" style={{ animationDelay: "0.5s" }}>{">"}</span>
        </p>
      </div>

      {/* Bottom grass */}
      <svg className="shrink-0 w-full opacity-20 pointer-events-none h-6 sm:h-8" viewBox="0 0 400 32" preserveAspectRatio="none" fill="none">
        <path d="M0 32 Q8 16 16 28 Q24 8 32 24 Q40 12 48 28 Q56 4 64 24 Q72 14 80 28 Q88 6 96 24 Q104 14 112 28 Q120 4 128 24 Q136 12 144 28 Q152 6 160 26 Q168 14 176 28 Q184 8 192 24 Q200 12 208 28 Q216 4 224 24 Q232 14 240 28 Q248 6 256 24 Q264 12 272 28 Q280 4 288 24 Q296 14 304 28 Q312 6 320 24 Q328 12 336 28 Q344 4 352 24 Q360 14 368 28 Q376 8 384 24 Q392 14 400 28 V32 Z" fill="#5a9a6e"/>
      </svg>
    </div>
  )
}
