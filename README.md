# Handle element resizes

Nowadays browsers have started to support element resize handling natively using [ResizeObservers](https://wicg.github.io/ResizeObserver/). We use this feature (with a [polyfill](https://github.com/que-etc/resize-observer-polyfill)) to help you handle element resizes in Vue.  
No `window.resize` listeners! No timeouts! Just a pure implementation with a lightning-fast polyfill!

## Installation

```
yarn add vue-resize-observer
```

## Examples

#### Child Function Pattern

```jsx
import { Component, Prop, Vue } from 'vue-property-decorator'
import ReactResizeDetector from 'vue-resize-observer'

@Component
class TestView extends Vue {
  render () {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
      </div>
    )
  }

  onResize () {
    ...
  }
}

export default TestView
```

## API

| Prop           | Type   | Description                                                                                                                                                                                    | Default     |
| -------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| onResize       | Func   | Function that will be invoked with `width` and `height` arguments                                                                                                                              | `undefined` |
| handleWidth    | Bool   | Trigger `onResize` on width change                                                                                                                                                             | `true`      |
| handleHeight   | Bool   | Trigger `onResize` on height change                                                                                                                                                            | `true`      |
| skipOnMount    | Bool   | Do not trigger onResize when a component mounts                                                                                                                                                | `false`     |

## License

MIT

## ❤️

Show us some love and STAR ⭐ the project if you find it useful
