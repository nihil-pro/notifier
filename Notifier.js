import { UiNotification } from "./Ui.notification.js";

const style = `
<style>
    .ui-notification {
        font-family: system-ui;
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
  static alignments = { vertical: { top: 'top', bottom: 'bottom' }, horizontal: { left: 'left', right: 'right' } }
  #gap = 16 // space between notifications
  #yPosition = Notifier.alignments.vertical.bottom
  #xPosition = Notifier.alignments.horizontal.right
  #autoHideDuration = 0

  constructor() {
    Reflect.ownKeys(Notifier.prototype)
      .filter(key => key !== 'constructor')
      .forEach(method => this[method] = this[method].bind(this))
    const range = document.createRange()
    const styles = range.createContextualFragment(style)
    document.head.appendChild(styles)
    document.addEventListener(UiNotification.type, this.#whenNotificationReceived.bind(this))
  }

  #whenNotificationReceived(event) {
    if (event instanceof UiNotification) {
      const $popover = this.#createPopover(event)
      this.#appendToDom($popover)
      $popover.showPopover()
      this.#shiftOldestNotifications($popover.getBoundingClientRect().height);
      if (event.detail.closable) { $popover.addEventListener('click', event.hide, { once: true }); }
      const shouldAutoHide = event.detail.autoHideDuration || this.#autoHideDuration
      if(shouldAutoHide) { setTimeout(event.hide, shouldAutoHide); }
      $popover.addEventListener('click', event.detail.onClick)
    }
  }

  #appendToDom($popover) {
    let wasAppended = false
    // If there is an active dialog, we need to insert notification within it so that clicks will work
    for (const dialog of document.getElementsByTagName('dialog')) {
      if (dialog.open) {
        dialog.appendChild($popover);
        wasAppended = true;
        break
      }
    }
    if (!wasAppended) { document.body.appendChild($popover); }
  }

  #createPopover(event) {
    const $popover = document.createElement('article');
    $popover.popover = "manual";
    if (event instanceof UiNotification) {
      $popover.setAttribute('id', event.id)
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
    this.#autoHideDuration = parseInt(value) || 0
    return this
  }
}