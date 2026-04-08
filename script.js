import "./styles.css"

const stage = document.getElementById("stage")
const ctr = document.getElementById("ctr")
const sections = stage.querySelectorAll("section")
const total = sections.length

function currentSlide() {
  return Math.round(stage.scrollTop / stage.clientHeight)
}

document.addEventListener("keydown", (e) => {
  if (["ArrowDown", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault()
    const next = Math.min(currentSlide() + 1, total - 1)
    stage.scrollTo({ top: next * stage.clientHeight, behavior: "smooth" })
  }

  if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
    e.preventDefault()
    const prev = Math.max(currentSlide() - 1, 0)
    stage.scrollTo({ top: prev * stage.clientHeight, behavior: "smooth" })
  }
})

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        ctr.textContent = `${Number(entry.target.dataset.slide) + 1} / ${total}`
      }
    }
  },
  { root: stage, threshold: 0.5 },
)

sections.forEach((section, i) => {
  section.dataset.slide = i
  observer.observe(section)
})
