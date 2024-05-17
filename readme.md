## Notifier

A modern alternative to Notistack (or similar).
- Framework-agnostic
- Zero dependencies
- Small size – 1.5kb (gzipped)
- Customizable

### Usage
```js
// Import in your index.js/ts
import { Notifier } from 'notifier'
new Notifier()

// Somewhere in your code
import { NotifierNotification } from 'notifier'
new NotifierNotification({
    message: 'Hello world',
    color: 'success'
}) 
// That's all 😎
```

### Configuration
```js
// The notifier itself
import { Notifier } from 'notifier'

// Default alignment: vertical = bottom, horizontal = right

// top-left
new Notifier().alignToTop().alignToLeft()

// top-right
new Notifier().alignToTop()

// bottom-left
new Notifier().alignToLeft()

// top-left with auto-hide
new Notifier()
    .alignToTop()
    .alignToLeft()
    .setAutoHideDurationInMs(3000)


// The Notification
import { NotifierNotification } from 'notifier'
new NotifierNotification({
    message: 'Some string',
    color: 'success', // warning, error or undefined
    closable: false, // boolean or undefined. If true, shows a close button
    onClick: undefined, // Any callback you want to invoke, when user click to the notification
}) 
```

### Customization
```css
/* Somewhere in your css */
.ui-notification {
    /*  Customize me  */
    &.warning {  }
    &.error {  }
    &.success { }
    &.closable { 
        /*  Has an pseudo close button  */
        &:after {
         /* Apply icon styles here */
        }
    }
}
```

#### Tricks
It's a bad practice, but anyway
```typescript
// Somewhere in your d.ts
declare global {
  interface Window {
    NotifierNotification: NotifierNotification
  }
}

// In your index.js
Reflect.set(window, 'NotifierNotification', NotifierNotification)

// Anywhere in your code
new NotifierNotification({ 
  message: 'Using without import'
})
```

### FAQ
- <b>Does it work on {Some-browser-version}</b><br/>
  It works anywhere, where the hidePopover is supported. See the [Caniuse](https://caniuse.com/mdn-api_htmlelement_hidepopover).<br/>
  Chromium > 114; Safari > 17; Opera > 100; Firefox > 125 e.t.c
- <b>Can I add some html to notification?</b> <br />
  Not in this library. The notification should be simple.
  If you need something more complicated, use dialog instead.