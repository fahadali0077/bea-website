import { CartProvider } from "@/app/components/shop/CartProvider";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
