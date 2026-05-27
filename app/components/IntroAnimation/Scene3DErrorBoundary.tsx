'use client'

import {Component, type ReactNode} from 'react'

interface Props  { children: ReactNode; fallback?: ReactNode }
interface State  { hasError: boolean }

// Catches WebGL / Three.js errors so the rest of the intro still renders
export class Scene3DErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false}

  static getDerivedStateFromError() { return {hasError: true} }

  componentDidCatch(err: unknown) {
    console.warn('[Scene3D] WebGL error caught by boundary:', err)
  }

  render() {
    if (this.state.hasError) {
      // Transparent fallback — intro typography + nav still show on top
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
