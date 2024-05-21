export class NotifierNotification extends CustomEvent {
  static colors = { canvas: 'canvas', success: 'success', error: 'error', warning: 'warning' }
  static type = 'whenNotifierNotificationReceived'
  id = crypto.randomUUID()
  #target = undefined
  init

  constructor() {
    const detail = { message: '', color: NotifierNotification.colors.canvas, closable: true, onClick: () => {} }
    const init = { detail }
    super(NotifierNotification.type, init);
    this.init = init;
    Reflect.ownKeys(NotifierNotification.prototype)
      .filter(key => key !== 'constructor')
      .forEach(method => this[method] = this[method].bind(this))
  }

  setMessage(message = '') {
    this.init.detail.message = typeof message === 'string' ? message : message.toString();
    return this
  }

  /** Mark as error */
  error() {
    this.init.detail.color = NotifierNotification.colors.error
    return this
  }

  /** Mark as warning */
  warning() {
    this.init.detail.color = NotifierNotification.colors.warning
    return this
  }

  /** Mark as success */
  success() {
    this.init.detail.color = NotifierNotification.colors.success
    return this
  }

  /** Mark as Canvas color */
  canvas() {
    this.init.detail.color = NotifierNotification.colors.canvas
    return this
  }

  onClick(callback = () => {}) {
    if (typeof callback !== 'function') { throw new Error('Invalid argument. Only functions are allowed'); }
    this.init.detail.onClick = callback;
    return this
  }

  hideCloseButton() {
    this.init.detail.closable = false;
    return this
  }

  show() {
    if (this.#target) { throw new Error('This notification has already been displayed'); }
    document.dispatchEvent(this);
    this.#target = document.getElementById(this.id);
    return this
  }

  hide() {
    if (!this.#target) { throw new Error('You cannot close a notification that has not yet been displayed'); }
    this.#target.hidePopover();
    this.#target.remove();
    return this
  }
}