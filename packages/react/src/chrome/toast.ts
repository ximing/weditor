export function toast(message: string, owner?: HTMLElement | null): void {
  const container = owner ?? document.body
  Array.from(container.children)
    .filter((element) => element.classList.contains('deditor-toast'))
    .forEach((element) => element.remove())
  const el = document.createElement('div')
  el.className = 'deditor-toast'
  el.textContent = message
  container.appendChild(el)
  window.setTimeout(() => el.remove(), 2000)
}
