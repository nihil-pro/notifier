import { NotifierNotification } from "./Notifier.notification.js";

const style = `
<style>
    .ui-notification {
        max-width: 300px;
        position: fixed; 
        box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
        border-radius: 1rem;
        border: none;
        padding: 1rem;
        inset: unset; 
        &.closable {
            padding-right: 3rem;
            &:after {
              content: "✕";
              font-size: 1rem;
              position: absolute;
              height: 1.5rem;
              width: 1.5rem;
              right: .5rem;
              top: .75rem;
              display: grid;
              aspect-ratio: 1;
              place-content: center;
              border-radius: 100%;
            }
        }
        &.closable:hover { &:after { background-color: rgba(0,0,0,.1) } }
        &.left { left: 1rem };
        &.right { right: 1rem };
        &.warning { background-color: #fed945; }
        &.error { background-color: #fc3232; color: #fff }
        &.success { background-color: #21ba72; color: #fff }
    }
</style>
`

export class Notifier {
  static alignments = {
    vertical: { top: 'top', bottom: 'bottom' },
    horizontal: { left: 'left', right: 'right' }
  }

  #gap = 16 // space between notifications
  #yPosition = Notifier.alignments.vertical.bottom
  #xPosition = Notifier.alignments.horizontal.right
  #autoHideDuration = undefined

  constructor() {
    this.alignToBottom = this.alignToBottom.bind(this)
    this.alignToTop = this.alignToTop.bind(this)
    this.alignToLeft = this.alignToLeft.bind(this)
    this.alignToRight = this.alignToRight.bind(this)
    this.setAutoHideDurationInMs = this.setAutoHideDurationInMs.bind(this)
    const range = document.createRange()
    const styles = range.createContextualFragment(style)
    document.head.appendChild(styles)
    document.addEventListener(NotifierNotification.type, this.#whenNotificationReceived.bind(this))
  }

  #whenNotificationReceived(event) {
    if (event instanceof NotifierNotification) {
      const $popover = this.#createPopover(event)
      document.body.appendChild($popover)
      $popover.showPopover()

      $popover.addEventListener('toggle', (event) => {
        const notificationHeight = $popover.getBoundingClientRect().height
        if ('newState' in event && event.newState === "open") {
          this.#shiftOldestNotifications(notificationHeight);
        }
      });

      if (event.detail.closable) {
        $popover.addEventListener('click', () => {
          $popover.hidePopover()
          $popover.remove()
        }, { once: true })
      }

      if(this.#autoHideDuration) {
        setTimeout(() => {
          $popover.hidePopover()
          $popover.remove()
        }, this.#autoHideDuration)
      }

      $popover.addEventListener('click', event.detail.onClick)
    }
  }

  #createPopover(event) {
    const $popover = document.createElement('article');
    $popover.popover = "manual";
    if (event instanceof NotifierNotification) {
      $popover.textContent = event.detail.message.toString()
      $popover.classList.add('ui-notification', 'latest', this.#xPosition, event.detail.color)
      if (event.detail.closable) {
        $popover.classList.add('closable')
      }
    }
    return $popover
  }

  #shiftOldestNotifications(latestNotificationHeight) {
    const notifications = document.querySelectorAll(".ui-notification");
    notifications.forEach(notification => {
      if (notification.classList.contains('latest')) {
        notification.style[this.#yPosition] = `${this.#gap}px`
        notification.classList.remove('latest')
      } else {
        const prevOffset = notification.style[this.#yPosition].replace("px", "");
        const newOffset = parseInt(prevOffset) + latestNotificationHeight + this.#gap;
        notification.style[this.#yPosition] = `${newOffset}px`;
      }
    })
  }


  alignToTop() {
    this.#yPosition = Notifier.alignments.vertical.top
    return this
  }

  alignToBottom() {
    this.#yPosition = Notifier.alignments.vertical.bottom
    return this
  }

  alignToLeft() {
    this.#xPosition = Notifier.alignments.horizontal.left
    return this
  }

  alignToRight() {
    this.#xPosition = Notifier.alignments.horizontal.right
    return this
  }

  setAutoHideDurationInMs(value) {
    this.#autoHideDuration = parseInt(value) || undefined
    return this
  }
}