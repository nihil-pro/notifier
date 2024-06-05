export class UiNotification extends CustomEvent {
  static colors = { canvas: 'canvas', success: 'success', error: 'error', warning: 'warning' }
  static type = 'whenNotifierNotificationReceived'
  id = crypto.randomUUID()
  #target = undefined
  init

  constructor() {
    const detail = {
      message: '',
      color: UiNotification.colors.canvas,
      closable: true, onClick: () => {},
      autoHideDuration: 0
    }
    const init = { detail }
    super(UiNotification.type, init);
    this.init = init;
    Reflect.ownKeys(UiNotification.prototype)
      .filter(key => key !== 'constructor')
      .forEach(method => this[method] = this[method].bind(this))
  }

  /** The notification text */
  setMessage(message = '') {
    this.init.detail.message = typeof message === 'string' ? message : message.toString();
    return this
  }

  /** Mark as error */
  error() {
    this.init.detail.color = UiNotification.colors.error
    return this
  }

  /** Mark as warning */
  warning() {
    this.init.detail.color = UiNotification.colors.warning
    return this
  }

  /** Mark as success */
  success() {
    this.init.detail.color = UiNotification.colors.success
    return this
  }

  /** Mark as Canvas color */
  canvas() {
    this.init.detail.color = UiNotification.colors.canvas
    return this
  }

  /** A callback that will be triggered when the notification is clicked */
  onClick(callback = () => {}) {
    if (typeof callback !== 'function') {
      callback = () => {}
      console.info('Invalid argument. Only functions are allowed');
    }
    this.init.detail.onClick = callback;
    return this
  }

  hideCloseButton() {
    this.init.detail.closable = false;
    return this
  }

  /** This setting takes precedence over the Notifier */
  setAutoHideDurationInMs(duration= 0) {
    if (Number.isInteger(duration)) { this.init.detail.autoHideDuration = duration; }
    return this
  }

  show() {
    if (this.#target) {
      console.info('This notification has already been displayed');
      return this
    }
    document.dispatchEvent(this);
    this.#target = document.getElementById(this.id);
    return this
  }

  hide() {
    if (!this.#target) {
      console.info('You cannot close a notification that has not yet been displayed');
      return this
    }
    this.#target.hidePopover();
    this.#target.remove();
    this.#target = undefined
    return this
  }
}