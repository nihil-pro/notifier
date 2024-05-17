export { Notifier } from './Notifier.js'
export { NotifierNotification } from './Notifier.notification.js'

declare global {
  interface DocumentEventMap {
    whenNotifierNotificationReceived: NotifierNotification
  }
}
