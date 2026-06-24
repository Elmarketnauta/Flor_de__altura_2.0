import { useWishlistStore } from '@/store/wishlist-store'

describe('Wishlist Store', () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] })
  })

  it('should add product to wishlist', () => {
    useWishlistStore.getState().addToWishlist('prod-1', 'browse')
    const { items } = useWishlistStore.getState()
    expect(items.length).toBe(1)
    expect(items[0].productId).toBe('prod-1')
  })

  it('should not add duplicate products', () => {
    useWishlistStore.getState().addToWishlist('prod-1', 'browse')
    useWishlistStore.getState().addToWishlist('prod-1', 'recommendation')
    expect(useWishlistStore.getState().items.length).toBe(1)
  })

  it('should check if product is favorited', () => {
    const { addToWishlist, isFavorite } = useWishlistStore.getState()
    addToWishlist('prod-1', 'browse')
    expect(isFavorite('prod-1')).toBe(true)
    expect(isFavorite('prod-2')).toBe(false)
  })

  it('should remove product from wishlist', () => {
    useWishlistStore.getState().addToWishlist('prod-1', 'browse')
    useWishlistStore.getState().removeFromWishlist('prod-1')
    expect(useWishlistStore.getState().items.length).toBe(0)
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
    useWishlistStore.getState().addToWishlist('prod-1', 'browse')
    useWishlistStore.getState().addToWishlist('prod-2', 'browse')
    useWishlistStore.getState().clearWishlist()
    expect(useWishlistStore.getState().items.length).toBe(0)
  })
})
