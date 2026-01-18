export function renderFooter(handle: string): string {
  // Extract username from handle: {username}.{name}.{domain} -> username
  const username = handle.split('.')[0] || handle

  return `
    <footer id="footer" class="footer">
      <div class="license">
        <a href="https://git.syui.ai/ai/log" target="_blank" rel="noopener">
          <img src="/ai.svg" alt="ai" class="license-icon">
        </a>
      </div>
      <div class="footer-content">
        <span class="footer-copy">© ${username}</span>
      </div>
    </footer>
  `
}
