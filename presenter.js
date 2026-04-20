import "./presenter.css"
import { notes, slideTitles, slideTimes } from "./notes.js"

const CHANNEL = "sweetest-alert-deck"
const total = slideTitles.length
const channel = new BroadcastChannel(CHANNEL)

const els = {
  counter: document.getElementById("counter"),
  title: document.getElementById("title"),
  time: document.getElementById("time"),
  notes: document.getElementById("notes"),
  next: document.getElementById("next"),
}

let currentIndex = 0

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
  if (["ArrowDown", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault()
    channel.postMessage({ type: "nav", direction: "next" })
  } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
    e.preventDefault()
    channel.postMessage({ type: "nav", direction: "prev" })
  }
})

render(currentIndex)
