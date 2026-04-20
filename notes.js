import raw from "./notes.md?raw"

const TOTAL_SLIDES = 12

function inline(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
}

function parseSection(body) {
  const html = []
  const lines = body.split("\n")
  let paragraph = []

  const flush = () => {
    if (!paragraph.length) return
    const joined = paragraph.join(" ").trim()
    if (joined) html.push(`<p>${inline(joined)}</p>`)
    paragraph = []
  }

  for (const line of lines) {
    const quoted = line.match(/^>\s?(.*)$/)
    if (quoted) {
      const content = quoted[1]
      if (!content.trim()) flush()
      else paragraph.push(content)
    } else if (line.trim() === "") {
      flush()
    } else {
      flush()
      html.push(`<p class="aside">${inline(line.trim())}</p>`)
    }
  }
  flush()
  return html.join("\n")
}

function parseNotes(md) {
  const slides = new Array(TOTAL_SLIDES).fill("")
  const times = new Array(TOTAL_SLIDES).fill("")
  const re = /^## Slide (\d+)[^\n]*?(?:\(~([^)]+)\))?\s*$/gm
  const matches = [...md.matchAll(re)]

  matches.forEach((match, i) => {
    const slideNum = Number(match[1])
    const time = (match[2] || "").trim()
    const start = match.index + match[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length
    const body = md.slice(start, end)
    const htmlIndex = slideNum - 1
    if (htmlIndex >= 0 && htmlIndex < TOTAL_SLIDES) {
      slides[htmlIndex] = parseSection(body)
      times[htmlIndex] = time
    }
  })

  return { slides, times }
}

const parsed = parseNotes(raw)
export const notes = parsed.slides
export const slideTimes = parsed.times
export const slideTitles = [
  "Intro",
  "The Sweetest Alert",
  "Sweet Alert Has Overstayed",
  "The Browser's Gift",
  "Sweetest Alert",
  "By the Numbers",
  "The Strategy",
  "Packaging",
  "Rails Support",
  "AI as Dev Partner",
  "The Payoff",
  "Thanks!",
]
