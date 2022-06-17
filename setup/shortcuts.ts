
import { defineShortcutsSetup, NavOperations } from '@slidev/types'
import * as slidev from '@slidev/client/logic/nav'

export default defineShortcutsSetup((nav: NavOperations) => {
  return [
    {
      key: 'enter',
      fn: () => nav.next(),
      autoRepeat: true,
    },
    {
      key: 'backspace',
      fn: () => nav.prev(),
      autoRepeat: true,
    },
    {
      key: 'e',
      fn: () => slidev.go(32),
      autoRepeat: true,
    },
  ]
})
