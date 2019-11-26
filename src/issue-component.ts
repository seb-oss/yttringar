import { Issue } from './github'
import { timeAgo, formatDate } from './time-ago'
import { scheduleMeasure } from './measure'
// import {
//   getReactionsMenuHtml,
//   getReactionHtml,
//   getSignInToReactMenuHtml
// } from './reactions'

// const displayAssociations: Record<CommentAuthorAssociation, string> = {
//   COLLABORATOR: 'Collaborator',
//   CONTRIBUTOR: 'Contributor',
//   MEMBER: 'Member',
//   OWNER: 'Owner',
//   FIRST_TIME_CONTRIBUTOR: 'First time contributor',
//   FIRST_TIMER: 'First timer',
//   NONE: ''
// }

export class IssueComponent {
  public readonly element: HTMLElement

  constructor(public issue: Issue, creatorName: string) {
    const { html_url, created_at, title } = issue
    this.element = document.createElement('article')
    this.element.classList.add('timeline-comment')
    this.element.classList.add('issue-list-item')
    // if (user.login === currentUser) {
    //   this.element.classList.add('current-user')
    // }
    // const association = displayAssociations[author_association]
    // const reactionCount = reactionTypes.reduce(
    //   (sum, id) => sum + reactions[id],
    //   0
    // )
    this.element.innerHTML = `
    <div id="issue_1042" style="display: flex; flex-direction: row; margin-left: 16px;" >
      
      <div id="issue-icon" style="margin-top: 5px;" >
        <span aria-label="Open issue">
          <svg viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
          <path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
        </span>
      </div>

      <div class="issue-text-wrapper" style="display: flex; flex-direction: column; margin-left: 8px;">
        <a target="_blank" class="issue-title-link" href="${html_url}">${title}</a>
        <span class="issue-meta">
          Opened <relative-time title="${formatDate(
            new Date(created_at)
          )}">${timeAgo(Date.now(), new Date(created_at))}</relative-time> by
          <a target="_blank" title="View ${creatorName}'s profile" href="${
      issue.user.html_url
    }">${creatorName}</a>
        </span>
      </div>

    </div>
`

    // const markdownBody = this.element.querySelector('.markdown-body')!
    // const emailToggle = markdownBody.querySelector(
    //   '.email-hidden-toggle a'
    // ) as HTMLAnchorElement
    // if (emailToggle) {
    //   const emailReply = markdownBody.querySelector(
    //     '.email-hidden-reply'
    //   ) as HTMLDivElement
    //   emailToggle.onclick = event => {
    //     event.preventDefault()
    //     emailReply.classList.toggle('expanded')
    //   }
    // }

    // processRenderedMarkdown(markdownBody)
    scheduleMeasure()
  }

  // public setCurrentUser(currentUser: string | null) {
  //   if (this.currentUser === currentUser) {
  //     return
  //   }
  //   this.currentUser = currentUser

  //   if (this.issue.user.login === this.currentUser) {
  //     this.element.classList.add('current-user')
  //   } else {
  //     this.element.classList.remove('current-user')
  //   }
  // }
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
