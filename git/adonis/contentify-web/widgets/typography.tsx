import React from 'react'

export function Heading1({ children, className }: HeadingProps) {
  return (
    <h1 className={`text-6xl font-bold tracking-tighter ${className ?? ''}`}>
      {children}
    </h1>
  )
}

export function Heading2({ children, className }: HeadingProps) {
  return (
    <h2 className={`text-5xl font-bold tracking-tighter ${className ?? ''}`}>
      {children}
    </h2>
  )
}

export function Heading3({ children, className }: HeadingProps) {
  return (
    <h3 className={`text-4xl font-bold tracking-tighter ${className ?? ''}`}>
      {children}
    </h3>
  )
}

export function Heading4({ children, className }: HeadingProps) {
  return (
    <h4 className={`text-3xl font-bold tracking-tighter ${className ?? ''}`}>
      {children}
    </h4>
  )
}

export function Heading5({ children, className }: HeadingProps) {
  return (
    <h5 className={`text-2xl font-bold tracking-tighter ${className ?? ''}`}>
      {children}
    </h5>
  )
}

export function Title({ children, className }: TextProps) {
  return (
    <h5 className={`text-lg font-bold tracking-tighter ${className ?? ''}`}>
      {children}
    </h5>
  )
}

export function Text({ children, className }: TextProps) {
  return <p className={`${className ?? ''}`}>{children}</p>
}

export function Caption({ children, className }: TextProps) {
  return (
    <span className={`text-neutral-500 ${className ?? ''}`}>{children}</span>
  )
}
