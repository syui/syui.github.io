import { getNetworks } from '../lib/api'
import { isLoggedIn } from '../lib/auth'

let currentNetwork = 'bsky.social'
let currentLang = localStorage.getItem('preferred-lang') || 'en'

export function getCurrentNetwork(): string {
  return currentNetwork
}

export function setCurrentNetwork(network: string): void {
  currentNetwork = network
}

export function getCurrentLang(): string {
  return currentLang
}

export function setCurrentLang(lang: string): void {
  currentLang = lang
  localStorage.setItem('preferred-lang', lang)
}

export function renderModeTabs(handle: string, activeTab: 'blog' | 'browser' | 'post' = 'blog'): string {
  let tabs = `
    <a href="/" class="tab">/</a>
    <a href="/@${handle}" class="tab ${activeTab === 'blog' ? 'active' : ''}">${handle}</a>
    <a href="/@${handle}/at" class="tab ${activeTab === 'browser' ? 'active' : ''}">at</a>
  `

  if (isLoggedIn()) {
    tabs += `<a href="/@${handle}/at/post" class="tab ${activeTab === 'post' ? 'active' : ''}">post</a>`
  }

  tabs += `
    <div class="pds-selector" id="pds-selector">
      <button type="button" class="tab" id="pds-tab">pds</button>
      <div class="pds-dropdown" id="pds-dropdown"></div>
    </div>
  `

  return `<div class="mode-tabs">${tabs}</div>`
}

// Render language selector (above content)
export function renderLangSelector(langs: string[]): string {
  if (langs.length < 2) return ''

  return `
    <div class="lang-selector" id="lang-selector">
      <button type="button" class="lang-btn" id="lang-tab">
        <img src="/icon/language.svg" alt="Lang" class="lang-icon">
      </button>
      <div class="lang-dropdown" id="lang-dropdown"></div>
    </div>
  `
}

export async function setupModeTabs(onNetworkChange: (network: string) => void, availableLangs?: string[], onLangChange?: (lang: string) => void): Promise<void> {
  const pdsTab = document.getElementById('pds-tab')
  const pdsDropdown = document.getElementById('pds-dropdown')

  if (pdsTab && pdsDropdown) {
    // Load networks
    const networks = await getNetworks()

    // Build options
    const optionsHtml = Object.keys(networks).map(key => {
      const isSelected = key === currentNetwork
      return `
        <div class="pds-option ${isSelected ? 'selected' : ''}" data-network="${key}">
          <span class="pds-name">${key}</span>
          <span class="pds-check">✓</span>
        </div>
      `
    }).join('')

    pdsDropdown.innerHTML = optionsHtml

    // Toggle dropdown
    pdsTab.addEventListener('click', (e) => {
      e.stopPropagation()
      pdsDropdown.classList.toggle('show')
    })

    // Handle option selection
    pdsDropdown.querySelectorAll('.pds-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation()
        const network = (opt as HTMLElement).dataset.network || ''

        currentNetwork = network

        // Update UI
        pdsDropdown.querySelectorAll('.pds-option').forEach(o => {
          o.classList.remove('selected')
        })
        opt.classList.add('selected')
        pdsDropdown.classList.remove('show')

        onNetworkChange(network)
      })
    })
  }

  // Setup language selector
  const langTab = document.getElementById('lang-tab')
  const langDropdown = document.getElementById('lang-dropdown')

  if (langTab && langDropdown && availableLangs && availableLangs.length > 0) {
    // Build language options
    const langOptionsHtml = availableLangs.map(lang => {
      const isSelected = lang === currentLang
      return `
        <div class="lang-option ${isSelected ? 'selected' : ''}" data-lang="${lang}">
          <span class="lang-name">${lang.toUpperCase()}</span>
          <span class="lang-check">✓</span>
        </div>
      `
    }).join('')

    langDropdown.innerHTML = langOptionsHtml

    // Toggle dropdown
    langTab.addEventListener('click', (e) => {
      e.stopPropagation()
      langDropdown.classList.toggle('show')
    })

    // Handle option selection
    langDropdown.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation()
        const lang = (opt as HTMLElement).dataset.lang || ''

        setCurrentLang(lang)

        // Update UI
        langDropdown.querySelectorAll('.lang-option').forEach(o => {
          o.classList.remove('selected')
        })
        opt.classList.add('selected')
        langDropdown.classList.remove('show')

        if (onLangChange) onLangChange(lang)
      })
    })
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    pdsDropdown?.classList.remove('show')
    langDropdown?.classList.remove('show')
  })
}
