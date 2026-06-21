import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: 'test-1',
  slug: 'test-1',
  name: 'Test Coffee',
  tagline: 'A test coffee',
  description: 'Test description',
  scaScore: 85,
  altitude: 1700,
  process: 'Washed',
  variety: 'Arabica',
  origin: 'Test Origin',
  notes: ['Test', 'Notes'],
  price: 50,
  weightGrams: 250,
  image: '/test.jpg',
  available: true,
}

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isOpen: false,
      lastModified: Date.now(),
      syncStatus: 'idle',
    })
  })

  it('should add an item to cart', () => {
    const { addItem, items } = useCartStore.getState()
    addItem(mockProduct, 'grano', 1)
    expect(items.length).toBe(1)
    expect(items[0].name).toBe('Test Coffee')
  })

  it('should increment quantity on duplicate add', () => {
    const { addItem, items } = useCartStore.getState()
    addItem(mockProduct, 'grano', 1)
    addItem(mockProduct, 'grano', 2)
    expect(items.length).toBe(1)
    expect(items[0].quantity).toBe(3)
  })

  it('should remove an item from cart', () => {
    const { addItem, removeItem, items } = useCartStore.getState()
    addItem(mockProduct, 'grano', 1)
    const lineId = items[0].id
    removeItem(lineId)
    expect(items.length).toBe(0)
  })

  it('should calculate total price correctly', () => {
    const { addItem, totalPrice } = useCartStore.getState()
    addItem(mockProduct, 'grano', 2)
    expect(totalPrice()).toBe(100)
  })

  it('should validate minimum order', () => {
    const { addItem, meetsMinimumOrder } = useCartStore.getState()
    addItem(mockProduct, 'grano', 1)
    expect(meetsMinimumOrder()).toBe(false)
    addItem({ ...mockProduct, price: 60 }, 'grano', 1)
    expect(meetsMinimumOrder()).toBe(true)
  })

  it('should allow checkout when minimum met', () => {
    const { addItem, canCheckout } = useCartStore.getState()
    addItem({ ...mockProduct, price: 150 }, 'grano', 1)
    expect(canCheckout()).toBe(true)
  })

  it('should clear cart', () => {
    const { addItem, clearCart, items } = useCartStore.getState()
    addItem(mockProduct, 'grano', 1)
    clearCart()
    expect(items.length).toBe(0)
  })
})
