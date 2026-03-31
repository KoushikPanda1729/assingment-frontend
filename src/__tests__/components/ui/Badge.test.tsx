import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../../../components/ui/Badge'

describe('Badge', () => {
  it('renders default label text', () => {
    render(<Badge variant="safe" />)
    expect(screen.getByText('Safe')).toBeInTheDocument()
  })

  it('applies safe variant styling', () => {
    render(<Badge variant="safe" />)
    expect(screen.getByText('Safe').className).toMatch(/emerald/)
  })

  it('applies flagged variant styling', () => {
    render(<Badge variant="flagged" />)
    expect(screen.getByText('Flagged').className).toMatch(/red/)
  })

  it('applies processing variant styling', () => {
    render(<Badge variant="processing" />)
    expect(screen.getByText('Processing').className).toMatch(/amber/)
  })

  it('shows dot span inside badge', () => {
    const { container } = render(<Badge variant="safe" />)
    expect(container.querySelector('span > span')).toBeTruthy()
  })
})
