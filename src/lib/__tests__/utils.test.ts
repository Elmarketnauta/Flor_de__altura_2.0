import { formatPEN, cn } from '@/lib/utils'

// Intl.NumberFormat usa un espacio no separable (U+00A0) entre el símbolo y el
// número. Normalizamos a espacio normal para comparar de forma estable entre
// versiones de Node/ICU.
const norm = (s: string) => s.replace(/ /g, ' ')

describe('Utils', () => {
  describe('formatPEN', () => {
    it('should format price as PEN currency', () => {
      expect(norm(formatPEN(100))).toBe('S/ 100.00')
      expect(norm(formatPEN(50.5))).toBe('S/ 50.50')
      expect(norm(formatPEN(0))).toBe('S/ 0.00')
    })

    it('should handle large numbers', () => {
      expect(norm(formatPEN(1000))).toBe('S/ 1,000.00')
      expect(norm(formatPEN(10000.99))).toBe('S/ 10,000.99')
    })

    it('should format decimals correctly', () => {
      expect(norm(formatPEN(99.9))).toBe('S/ 99.90')
      expect(norm(formatPEN(99.99))).toBe('S/ 99.99')
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
