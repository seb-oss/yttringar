import {
  User,
  Issue,
  getNameFromUserLogin,
  getIssuesPageForTermInBody
} from './github'
import { IssueComponent } from './issue-component'

export class TimelineComponent {
  public readonly element: HTMLElement
  private readonly timeline: IssueComponent[] = []
  private readonly countAnchor: HTMLAnchorElement
  private readonly marker: Node
  private count: number = 0

  constructor(
    private user: User | null,
    private issues: Issue[],
    pageId: string | null
  ) {
    this.element = document.createElement('main')
    this.element.classList.add('timeline')
    this.element.innerHTML = `
      <h1 class="timeline-header">
        <a target="_blank" class="text-link" href="${getIssuesPageForTermInBody(
          pageId as string
        )}"></a>
        <em>
          - powered by
          <a class="text-link" href="https://github.com/sebgroup/yttringar" target="_blank">yttringar</a>
        </em>
      </h1>`
    this.countAnchor = this.element.firstElementChild!
      .firstElementChild as HTMLAnchorElement
    this.marker = document.createComment('marker')
    this.element.appendChild(this.marker)
    this.setIssues(this.issues)
    this.renderCount()
  }

  // public setUser(user: User | null) {
  //   this.user = user
  //   const login = user ? user.login : null
  //   for (let i = 0; i < this.timeline.length; i++) {
  //     this.timeline[i].setCurrentUser(login)
  //   }
  //   scheduleMeasure()
  // }

  public async setIssues(issues: Issue[]) {
    this.issues = issues
    if (issues) {
      issues.reduce((promise: Promise<void>, issue: Issue) => {
        return promise.then(() => this.insertIssue(issue))
      }, Promise.resolve())
    } else {
      this.countAnchor.removeAttribute('href')
    }
  }

  public async insertIssue(issue: Issue) {
    const userfullName = await getNameFromUserLogin(issue.user.login)
    const issueComponent = new IssueComponent(issue, userfullName)
    this.timeline.push(issueComponent)
    this.element.insertBefore(issueComponent.element, this.marker)
    this.count += 1
    this.renderCount()
  }

  // public insertPageLoader(
  //   insertAfter: IssueComment,
  //   count: number,
  //   callback: () => void
  // ) {
  //   const { element: insertAfterElement } = this.timeline.find(
  //     x => x.comment.id >= insertAfter.id
  //   )!
  //   insertAfterElement.insertAdjacentHTML(
  //     'afterend',
  //     `
  //     <div class="page-loader">
  //       <div class="zigzag"></div>
  //       <button type="button" class="btn btn-outline btn-large">
  //         ${count} hidden items<br/>
  //         <span>Load more...</span>
  //       </button>
  //     </div>
  //   `
  //   )
  //   const element = insertAfterElement.nextElementSibling!
  //   const button = element.lastElementChild! as HTMLButtonElement
  //   const statusSpan = button.lastElementChild!
  //   button.onclick = callback

  //   return {
  //     setBusy() {
  //       statusSpan.textContent = 'Loading...'
  //       button.disabled = true
  //     },
  //     remove() {
  //       button.onclick = null
  //       element.remove()
  //     }
  //   }
  // }

  private renderCount() {
    this.countAnchor.textContent = `${this.count} Issue${
      this.count === 1 ? '' : 's'
    }`
  }
}
