export function toast(message: string): void {
  document.querySelectorAll('.weditor-toast').forEach((el) => el.remove())
  const el = document.createElement('div')
  el.className = 'weditor-toast'
  el.textContent = message
  document.body.appendChild(el)
  window.setTimeout(() => el.remove(), 2000)
}
