import "./styles.css"

const stage = document.getElementById("stage")
const ctr = document.getElementById("ctr")
const sections = stage.querySelectorAll("section")
const total = sections.length
const channel = new BroadcastChannel("sweetest-alert-deck")

function currentSlide() {
  return Math.round(stage.scrollTop / stage.clientHeight)
}

function goTo(index) {
  const clamped = Math.max(0, Math.min(total - 1, index))
  stage.scrollTo({ top: clamped * stage.clientHeight, behavior: "smooth" })
}

document.addEventListener("keydown", (e) => {
  if (["ArrowDown", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault()
    goTo(currentSlide() + 1)
  } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
    e.preventDefault()
    goTo(currentSlide() - 1)
  } else if (e.key === "p" || e.key === "P") {
    e.preventDefault()
    const url = new URL("presenter.html", window.location.href).toString()
    window.open(url, "sweetest-alert-presenter", "popup,width=1200,height=800")
  }
})

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const index = Number(entry.target.dataset.slide)
        ctr.textContent = `${index + 1} / ${total}`
        channel.postMessage({ type: "slide", index })
      }
    }
  },
  { root: stage, threshold: 0.5 },
)

sections.forEach((section, i) => {
  section.dataset.slide = i
  observer.observe(section)
})

channel.addEventListener("message", (e) => {
  const { type, direction } = e.data ?? {}
  if (type === "nav") {
    if (direction === "next") goTo(currentSlide() + 1)
    else if (direction === "prev") goTo(currentSlide() - 1)
  } else if (type === "request-slide") {
    channel.postMessage({ type: "slide", index: currentSlide() })
  }
})

channel.postMessage({ type: "slide", index: currentSlide() })
