import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../../../components/ui/Avatar'

describe('Avatar', () => {
  it('shows initials of name', () => {
    render(<Avatar name="Alice Smith" />)
    expect(screen.getByText('AS')).toBeInTheDocument()
  })

  it('shows single initial for single name', () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('applies size md by default', () => {
    const { container } = render(<Avatar name="Bob" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Avatar name="Bob" size="sm" />)
    expect((container.firstChild as HTMLElement)?.className).toMatch(/w-7|w-8|h-7|h-8/)
  })

  it('applies lg size class', () => {
    const { container } = render(<Avatar name="Bob" size="lg" />)
    expect((container.firstChild as HTMLElement)?.className).toMatch(/w-12|w-14|h-12|h-14/)
  })
})
