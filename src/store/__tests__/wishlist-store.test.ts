import { useWishlistStore } from '@/store/wishlist-store'

describe('Wishlist Store', () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] })
  })

  it('should add product to wishlist', () => {
    const { addToWishlist, items } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    expect(items.length).toBe(1)
    expect(items[0].productId).toBe('prod-1')
  })

  it('should not add duplicate products', () => {
    const { addToWishlist, items } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    addToWishlist('prod-1', 'recommendation')
    expect(items.length).toBe(1)
  })

  it('should check if product is favorited', () => {
    const { addToWishlist, isFavorite } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    expect(isFavorite('prod-1')).toBe(true)
    expect(isFavorite('prod-2')).toBe(false)
  })

  it('should remove product from wishlist', () => {
    const { addToWishlist, removeFromWishlist, items } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    removeFromWishlist('prod-1')
    expect(items.length).toBe(0)
  })

  it('should return wishlist count', () => {
    const { addToWishlist, wishlistCount } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    addToWishlist('prod-2', 'browse')
    expect(wishlistCount()).toBe(2)
  })

  it('should return wishlist product IDs', () => {
    const { addToWishlist, getWishlistProductIds } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    addToWishlist('prod-2', 'recommendation')
    const ids = getWishlistProductIds()
    expect(ids).toContain('prod-1')
    expect(ids).toContain('prod-2')
  })

  it('should clear entire wishlist', () => {
    const { addToWishlist, clearWishlist, items } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    addToWishlist('prod-2', 'browse')
    clearWishlist()
    expect(items.length).toBe(0)
  })
})
