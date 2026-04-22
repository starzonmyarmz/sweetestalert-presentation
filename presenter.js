import "./presenter.css"
import { notes, slideTitles, slideTimes } from "./notes.js"

const CHANNEL = "sweetest-alert-deck"
const total = slideTitles.length
const channel = new BroadcastChannel(CHANNEL)

const els = {
  counter: document.getElementById("counter"),
  timer: document.getElementById("timer"),
  title: document.getElementById("title"),
  time: document.getElementById("time"),
  notes: document.getElementById("notes"),
  next: document.getElementById("next"),
}

let currentIndex = 0

const targetSeconds = 9 * 60

let elapsedMs = 0
let runStart = null
let timerTick = null

function formatClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = String(Math.floor(total / 60)).padStart(2, "0")
  const s = String(total % 60).padStart(2, "0")
  return `${m}:${s}`
}

function renderTimer() {
  const running = runStart !== null
  const ms = elapsedMs + (running ? Date.now() - runStart : 0)
  els.timer.textContent = formatClock(ms)
  els.timer.classList.toggle("running", running)
  els.timer.classList.toggle(
    "over",
    targetSeconds > 0 && ms / 1000 > targetSeconds,
  )
}

function startTimer() {
  if (runStart !== null) return
  runStart = Date.now()
  timerTick = setInterval(renderTimer, 500)
  renderTimer()
}

function pauseTimer() {
  if (runStart === null) return
  elapsedMs += Date.now() - runStart
  runStart = null
  clearInterval(timerTick)
  timerTick = null
  renderTimer()
}

function resetTimer() {
  elapsedMs = 0
  if (runStart !== null) runStart = Date.now()
  renderTimer()
}

function toggleTimer() {
  if (runStart === null) startTimer()
  else pauseTimer()
}

els.timer.addEventListener("click", toggleTimer)

function render(index) {
  currentIndex = index
  const safe = Math.max(0, Math.min(total - 1, index))
  els.counter.textContent = `${safe + 1} / ${total}`
  els.title.textContent = slideTitles[safe] ?? "—"
  const t = slideTimes[safe]
  els.time.textContent = t ? `~${t}` : ""
  els.time.hidden = !t
  els.notes.innerHTML =
    notes[safe] || `<p class="aside">No notes for this slide.</p>`
  const nextIdx = safe + 1
  els.next.textContent = nextIdx < total ? slideTitles[nextIdx] : "— end —"
}

channel.addEventListener("message", (e) => {
  const { type, index } = e.data ?? {}
  if (type === "slide" && Number.isInteger(index)) render(index)
})

channel.postMessage({ type: "request-slide" })

document.addEventListener("keydown", (e) => {
  if (e.target === els.timer) return
  if (["ArrowDown", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault()
    channel.postMessage({ type: "nav", direction: "next" })
    startTimer()
  } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
    e.preventDefault()
    channel.postMessage({ type: "nav", direction: "prev" })
    startTimer()
  } else if (e.key === "t") {
    e.preventDefault()
    toggleTimer()
  } else if (e.key === "R") {
    e.preventDefault()
    resetTimer()
  }
})

render(currentIndex)
renderTimer()
