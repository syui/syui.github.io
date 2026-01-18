import { getNetworks } from '../lib/api'

let currentPds: string | null = null

export function getCurrentPds(): string | null {
  return currentPds
}

export function setCurrentPds(pds: string): void {
  currentPds = pds
}

export function renderPdsSelector(): string {
  return `
    <div class="pds-selector">
      <button class="pds-trigger" id="pds-trigger">
        <span>pds</span>
      </button>
      <div class="pds-dropdown" id="pds-dropdown" style="display: none;">
        <div class="pds-dropdown-content" id="pds-dropdown-content">
          <!-- Options loaded dynamically -->
        </div>
      </div>
    </div>
  `
}

export async function setupPdsSelector(onSelect: (pds: string, domain: string) => void): Promise<void> {
  const trigger = document.getElementById('pds-trigger')
  const dropdown = document.getElementById('pds-dropdown')
  const content = document.getElementById('pds-dropdown-content')

  if (!trigger || !dropdown || !content) return

  // Load networks and build options
  const networks = await getNetworks()
  const firstDomain = Object.keys(networks)[0]

  // Set default
  if (!currentPds && firstDomain) {
    currentPds = networks[firstDomain].bsky
  }

  const optionsHtml = Object.entries(networks).map(([domain, network]) => {
    const isSelected = currentPds === network.bsky
    return `
      <button class="pds-option ${isSelected ? 'selected' : ''}" data-pds="${network.bsky}" data-domain="${domain}">
        <span class="pds-option-name">${domain}</span>
        <span class="pds-option-check">${isSelected ? '●' : '○'}</span>
      </button>
    `
  }).join('')

  content.innerHTML = optionsHtml

  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation()
    const isVisible = dropdown.style.display !== 'none'
    dropdown.style.display = isVisible ? 'none' : 'block'
  })

  // Close on outside click
  document.addEventListener('click', () => {
    dropdown.style.display = 'none'
  })

  // Handle option selection
  content.querySelectorAll('.pds-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const pds = btn.getAttribute('data-pds') || ''
      const domain = btn.getAttribute('data-domain') || ''

      currentPds = pds

      // Update UI
      content.querySelectorAll('.pds-option').forEach(b => {
        b.classList.remove('selected')
        const check = b.querySelector('.pds-option-check')
        if (check) check.textContent = '○'
      })
      btn.classList.add('selected')
      const check = btn.querySelector('.pds-option-check')
      if (check) check.textContent = '●'

      dropdown.style.display = 'none'
      onSelect(pds, domain)
    })
  })
}
