import { CommentAuthorAssociation, Issue, reactionTypes } from './github'
import { timeAgo } from './time-ago'
import { scheduleMeasure } from './measure'
import {
  getReactionsMenuHtml,
  getReactionHtml,
  getSignInToReactMenuHtml
} from './reactions'

const avatarArgs = '?v=3&s=88'
const displayAssociations: Record<CommentAuthorAssociation, string> = {
  COLLABORATOR: 'Collaborator',
  CONTRIBUTOR: 'Contributor',
  MEMBER: 'Member',
  OWNER: 'Owner',
  FIRST_TIME_CONTRIBUTOR: 'First time contributor',
  FIRST_TIMER: 'First timer',
  NONE: ''
}

export class IssueComponent {
  public readonly element: HTMLElement

  constructor(public issue: Issue, private currentUser: string | null) {
    const {
      user,
      html_url,
      created_at,
      author_association,
      reactions,
      title
    } = issue
    console.log(user)
    this.element = document.createElement('article')
    this.element.classList.add('timeline-comment')
    if (user.login === currentUser) {
      this.element.classList.add('current-user')
    }
    const association = displayAssociations[author_association]
    const reactionCount = reactionTypes.reduce(
      (sum, id) => sum + reactions[id],
      0
    )
    this.element.innerHTML = `
      <a class="avatar" href="${user.html_url}" target="_blank" tabindex="-1">
        <img alt="@${user.login}" height="44" width="44"
              src="${user.avatar_url}${avatarArgs}">
      </a>
      <div class="comment">
        <header class="comment-header">
          <span class="comment-meta">
            <a class="text-link" href="${
              user.html_url
            }" target="_blank"><strong>${user.login}</strong></a>
            commented
            <a class="text-link" href="${html_url}" target="_blank">${timeAgo(
      Date.now(),
      new Date(created_at)
    )}</a>
          </span>
          <div class="comment-actions">
            ${
              association
                ? `<span class="author-association-badge">${association}</span>`
                : ''
            }
            ${
              currentUser
                ? getReactionsMenuHtml(issue.reactions.url, 'right')
                : getSignInToReactMenuHtml('right')
            }
          </div>
        </header>
        <div class="markdown-body markdown-body-scrollable">
          ${title}
        </div>
        <div class="comment-footer" reaction-count="${reactionCount}" reaction-url="${
      reactions.url
    }">
          <form class="reaction-list BtnGroup" action="javascript:">
            ${reactionTypes
              .map(id =>
                getReactionHtml(reactions.url, id, !currentUser, reactions[id])
              )
              .join('')}
          </form>
          ${
            currentUser
              ? getReactionsMenuHtml(issue.reactions.url, 'center')
              : getSignInToReactMenuHtml('center')
          }
        </div>
      </div>`
    console.log(this.element)

    const markdownBody = this.element.querySelector('.markdown-body')!
    const emailToggle = markdownBody.querySelector(
      '.email-hidden-toggle a'
    ) as HTMLAnchorElement
    if (emailToggle) {
      const emailReply = markdownBody.querySelector(
        '.email-hidden-reply'
      ) as HTMLDivElement
      emailToggle.onclick = event => {
        event.preventDefault()
        emailReply.classList.toggle('expanded')
      }
    }

    processRenderedMarkdown(markdownBody)
  }

  public setCurrentUser(currentUser: string | null) {
    if (this.currentUser === currentUser) {
      return
    }
    this.currentUser = currentUser

    if (this.issue.user.login === this.currentUser) {
      this.element.classList.add('current-user')
    } else {
      this.element.classList.remove('current-user')
    }
  }
}

export function processRenderedMarkdown(markdownBody: Element) {
  Array.from(
    markdownBody.querySelectorAll<HTMLAnchorElement>(
      ':not(.email-hidden-toggle) > a'
    )
  ).forEach(a => {
    a.target = '_top'
    a.rel = 'noopener noreferrer'
  })
  Array.from(markdownBody.querySelectorAll<HTMLImageElement>('img')).forEach(
    img => (img.onload = scheduleMeasure)
  )
  Array.from(
    markdownBody.querySelectorAll<HTMLAnchorElement>('a.commit-tease-sha')
  ).forEach(a => (a.href = 'https://github.com' + a.pathname))
}
