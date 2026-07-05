import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { tokens } from '../lib/design-tokens'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[InterviewMaster AI] Render error:', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Something went wrong</p>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Unexpected error</h1>
          <p className="mt-3 max-w-md text-muted">We hit an unexpected issue. Please refresh or return home.</p>
          <div className="mt-8 flex gap-3">
            <button className={tokens.btnPrimary} onClick={() => window.location.reload()}>
              Refresh
            </button>
            <Link to="/" className={tokens.btnSecondary}>
              Go Home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
