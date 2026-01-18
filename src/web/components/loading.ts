// Loading indicator component

export function showLoading(container: HTMLElement): void {
  const existing = container.querySelector('.loading-overlay')
  if (existing) return

  const overlay = document.createElement('div')
  overlay.className = 'loading-overlay'
  overlay.innerHTML = '<div class="loading-spinner"></div>'
  container.appendChild(overlay)
}

export function hideLoading(container: HTMLElement): void {
  const overlay = container.querySelector('.loading-overlay')
  if (overlay) {
    overlay.remove()
  }
}

export function renderLoadingSmall(): string {
  return '<div class="loading-small">Loading...</div>'
}
