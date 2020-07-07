import ResizeObserver from 'resize-observer-polyfill'
import { CreateElement } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

interface CancelableRaf<T> {
  (...args: T[]): void;
  cancel?: () => void;
}

function rafSchd <T> (fn: (...args: T[]) => void): CancelableRaf<T> {
  let lastArgs: T[] = []
  let frameId: number | null = null

  const wrapperFn = function (...args: T[]) {
    lastArgs = args

    if (frameId) {
      return
    }

    frameId = requestAnimationFrame(() => {
      frameId = null
      fn(...lastArgs)
    })
  }

  wrapperFn.cancel = function () {
    if (!frameId) {
      return
    }

    cancelAnimationFrame(frameId)
    frameId = null
  }

  return wrapperFn
}

@Component
export class ResizeDetector extends Vue {
  @Prop(Boolean)
  handleHeight!: boolean

  @Prop(Boolean)
  handleWidth!: boolean

  @Prop({ type: Boolean, default: true })
  skipOnMount!: boolean

  resizeObserver: ResizeObserver | null = null

  state = {
    width: undefined,
    height: undefined
  }

  skip = false
  element: Element | null = null
  raf: CancelableRaf<any> | null = null
  resizeHandler?: CancelableRaf<any> | null = null

  render (h: CreateElement) {
    return null
  }

  created () {
    this.resizeHandler = (entries: any[]) => {
      const { width: widthCurrent, height: heightCurrent } = this.state
      const { handleWidth, handleHeight } = this

      if (!handleWidth && !handleHeight) return

      const updater = this.createUpdater()

      entries.forEach(entry => {
        const { width, height } = (entry && entry.contentRect) || {}

        const isWidthChanged = handleWidth && widthCurrent !== width
        const isHeightChanged = handleHeight && heightCurrent !== height
        const isSizeChanged = isWidthChanged || isHeightChanged

        const shouldSetSize = !this.skip && isSizeChanged
        if (shouldSetSize) {
          updater({ width, height })
        }

        this.skip = false
      })
    }

    this.resizeObserver = new ResizeObserver(this.resizeHandler)

    this.$on('hook:mounted', () => {
      const parent = this.$parent
      const el = parent.$el || parent
      // check host container
      if (el.nodeType === 1) {
        this.element = el
      }
      this.skip = this.skipOnMount
      this.toggleObserver('observe')
    })
  }

  beforeDestroy () {
    this.toggleObserver('unobserve')
    this.cancelHandler()
  }

  private cancelHandler () {
    const ref = this.resizeHandler
    if (ref && ref.cancel) {
      // cancel debounced handler
      ref.cancel()
      this.resizeHandler = null
    }
  }

  private toggleObserver (method: keyof ResizeObserver) {
    const element = this.element
    if (!element || !this.resizeObserver![method]) return

    this.resizeObserver![method](element)
  }

  private createUpdater (): CancelableRaf<any> {
    this.rafClean()

    this.raf = rafSchd(({ width, height }) => {
      this.$emit('resize', { width, height })
      this.state = { width, height }
    })

    return this.raf
  }

  private rafClean () {
    if (this.raf && this.raf.cancel) {
      this.raf.cancel()
      this.raf = null
    }
  }

}
