function randomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return uint32.toString(16)
}
//@from https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col, amt) {
  var usePound = false

  if (col[0] == "#") {
    col = col.slice(1)
    usePound = true
  }

  var num = parseInt(col, 16)

  var r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  var b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  var g = (num & 0x0000ff) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16)
}

export default class Logger {
  static snack(log, element, color, ttl) {
    let _log = log
    let _element = element ? element : document.body
    _element.style.position = "relative"

    let _color = color ? color : "#0284c7"
    let _ttl = ttl ? ttl : 2500

    //Create logsnack container
    let container = null
    if (_element.getElementsByClassName("logsnack-container").length > 0) {
      container = _element.getElementsByClassName("logsnack-container")[0]
    } else {
      container = document.createElement("div")
      container.classList.add("logsnack-container")
      container.style.cssText =
        "display: flex; flex-direction: column-reverse; padding:16px; gap:12px; height:100%; pointer-events:none; position:sticky; right:0; bottom:0; z-index:100;"
      _element.appendChild(container)
    }

    //Create logsnack element
    let tag = document.createElement("div")
    let date = new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date())
    let id = randomId()
    tag.classList.add(`logsnack--${id}`)
    tag.style.cssText = `padding: 6px 12px; background-color:var(--logsnack-tag-background-${id}); box-shadow: 0px 0px 4px 2px rgba(0,0,0,0.1); border-radius:8px; color:var(--logsnack-tag-color-${id}); width:max-content;`
    tag.innerHTML = `<span style="font-size:0.75rem;">${date}</span> ${_log.toString()}`
    container.appendChild(tag)
    container.style.setProperty(`--logsnack-tag-color-${id}`, _color)
    container.style.setProperty(
      `--logsnack-tag-background-${id}`,
      LightenDarkenColor(_color, 225)
    )
    if (_ttl) {
      setTimeout(function () {
        container.removeChild(tag)
        container.style.removeProperty(`--logsnack-tag-color-${id}`)
        container.style.removeProperty(`--logsnack-tag-background-${id}`)
      }, _ttl)
    }
  }
}
