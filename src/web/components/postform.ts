import { createPost } from '../lib/auth'

export function renderPostForm(collection: string): string {
  return `
    <div class="post-form-container">
      <form class="post-form" id="post-form">
        <input
          type="text"
          class="post-form-title"
          id="post-title"
          placeholder="Title"
          required
        >
        <textarea
          class="post-form-body"
          id="post-body"
          placeholder="Content (markdown)"
          rows="6"
          required
        ></textarea>
        <div class="post-form-footer">
          <span class="post-form-collection">${collection}</span>
          <button type="submit" class="post-form-btn" id="post-submit">Post</button>
        </div>
      </form>
      <div id="post-status" class="post-status"></div>
    </div>
  `
}

export function setupPostForm(collection: string, onSuccess: () => void): void {
  const form = document.getElementById('post-form') as HTMLFormElement
  const titleInput = document.getElementById('post-title') as HTMLInputElement
  const bodyInput = document.getElementById('post-body') as HTMLTextAreaElement
  const submitBtn = document.getElementById('post-submit') as HTMLButtonElement
  const statusEl = document.getElementById('post-status') as HTMLDivElement

  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()

    if (!title || !body) return

    submitBtn.disabled = true
    submitBtn.textContent = 'Posting...'
    statusEl.innerHTML = ''

    try {
      const result = await createPost(collection, title, body)
      if (result) {
        statusEl.innerHTML = `<span class="post-success">Posted!</span>`
        titleInput.value = ''
        bodyInput.value = ''
        setTimeout(() => {
          onSuccess()
        }, 1000)
      }
    } catch (err) {
      statusEl.innerHTML = `<span class="post-error">Error: ${err}</span>`
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = 'Post'
    }
  })
}
