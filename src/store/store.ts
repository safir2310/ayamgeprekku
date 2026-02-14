import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  userId: string;
  username: string;
  email: string;
  noHp: string;
  photo?: string;
  role: string;
  memberLevel: string;
  saldo?: number;
}

interface CartItem {
  id: string;
  produkId: string;
  nama: string;
  harga: number;
  gambar?: string;
  jumlah: number;
}

interface StoreState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // Cart state
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (produkId: string) => void;
  updateCartQuantity: (produkId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wallet state
  saldo: number;
  setSaldo: (saldo: number) => void;

  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      token: null,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          saldo: user?.saldo || 0,
        }),
      setToken: (token) => set({ token }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          cart: [],
          saldo: 0,
          token: null,
        }),

      // Cart state
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.produkId === item.produkId
          );

          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.produkId === item.produkId
                  ? { ...i, jumlah: i.jumlah + item.jumlah }
                  : i
              ),
            };
          }

          return {
            cart: [...state.cart, { ...item, id: Math.random().toString() }],
          };
        }),
      removeFromCart: (produkId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.produkId !== produkId),
        })),
      updateCartQuantity: (produkId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.produkId === produkId ? { ...i, jumlah: Math.max(1, quantity) } : i
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const cart = get().cart;
        return cart.reduce((total, item) => total + item.harga * item.jumlah, 0);
      },
      getCartItemsCount: () => {
        const cart = get().cart;
        return cart.reduce((count, item) => count + item.jumlah, 0);
      },

      // Wallet state
      saldo: 0,
      setSaldo: (saldo) => set({ saldo }),

      // UI state
      isCartOpen: false,
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'ayam-geprek-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        saldo: state.saldo,
        token: state.token,
      }),
    }
  )
);
