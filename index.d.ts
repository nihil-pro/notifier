export { Notifier } from './Notifier.js'
export { UiNotification } from './Ui.notification.js'

declare global {
  interface DocumentEventMap {
    whenNotifierNotificationReceived: NotifierNotification
  }
}
