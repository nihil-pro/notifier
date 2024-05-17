function noop() {}

export class NotifierNotification extends CustomEvent {
  init
  static colors = {
    canvas: 'canvas',
    success: 'success',
    error: 'error',
    warning: 'warning'
  }
  static type = 'whenNotifierNotificationReceived'

  /** @param {{
      message?: string | undefined
      color?: 'canvas' | 'error' | 'success' | 'warning' | undefined
      closable?: boolean | undefined
      onClick?: Function | undefined
   }} detail */
  constructor(detail = {}) {
    const payload = {
      message: detail.message || '',
      color: detail.color || NotifierNotification.colors.canvas,
      closable: detail.closable === undefined ? true : detail.closable,
      onClick: detail.onClick || noop,
    }
    const isAllowedColor = Object.values(NotifierNotification.colors).includes(detail.color)
    if (!isAllowedColor) {
      payload.color = NotifierNotification.colors.canvas
      console.warn(`NotifierNotification: the Canvas color was set, because provided color is not allowed`)
    }
    const init = { detail: payload }
    super(NotifierNotification.type, init);
    this.init = init
    document.dispatchEvent(this)
  }
}