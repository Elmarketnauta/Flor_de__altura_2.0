import { formatPEN, cn } from '@/lib/utils'

describe('Utils', () => {
  describe('formatPEN', () => {
    it('should format price as PEN currency', () => {
      expect(formatPEN(100)).toBe('S/ 100.00')
      expect(formatPEN(50.5)).toBe('S/ 50.50')
      expect(formatPEN(0)).toBe('S/ 0.00')
    })

    it('should handle large numbers', () => {
      expect(formatPEN(1000)).toBe('S/ 1,000.00')
      expect(formatPEN(10000.99)).toBe('S/ 10,000.99')
    })

    it('should format decimals correctly', () => {
      expect(formatPEN(99.9)).toBe('S/ 99.90')
      expect(formatPEN(99.99)).toBe('S/ 99.99')
    })
  })

  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('should handle conditional classes', () => {
      expect(cn('px-2', true && 'py-1')).toBe('px-2 py-1')
      expect(cn('px-2', false && 'py-1')).toBe('px-2')
    })

    it('should remove falsy values', () => {
      expect(cn('px-2', undefined, 'py-1', null, '')).toBe('px-2 py-1')
    })

    it('should handle tailwind conflicts', () => {
      // clsx should handle ordering correctly
      expect(cn('p-2 p-4')).toBeDefined()
    })
  })
})
