import { isLoggedIn, getLoggedInHandle } from '../lib/auth'

export function renderHeader(currentHandle: string): string {
  const loggedIn = isLoggedIn()
  const handle = getLoggedInHandle()

  const loginBtn = loggedIn
    ? `<button type="button" class="header-btn user-btn" id="logout-btn" title="Logout">${handle || 'logout'}</button>`
    : `<button type="button" class="header-btn login-btn" id="login-btn" title="Login"><img src="/icon/user.svg" alt="Login" class="login-icon"></button>`

  return `
    <header id="header">
      <form class="header-form" id="header-form">
        <input
          type="text"
          class="header-input"
          id="header-input"
          placeholder="handle (e.g., syui.ai)"
          value="${currentHandle}"
        >
        <button type="submit" class="header-btn at-btn" title="Browse">@</button>
        ${loginBtn}
      </form>
    </header>
  `
}

export function mountHeader(
  container: HTMLElement,
  currentHandle: string,
  onBrowse: (handle: string) => void
): void {
  container.innerHTML = renderHeader(currentHandle)

  const form = document.getElementById('header-form') as HTMLFormElement
  const input = document.getElementById('header-input') as HTMLInputElement

  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const handle = input.value.trim()
    if (handle) {
      onBrowse(handle)
    }
  })
}
