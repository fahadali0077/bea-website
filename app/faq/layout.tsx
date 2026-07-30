import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Bea Dating App',
  description: 'Everything you need to know about Bea dating app. Find answers to frequently asked questions about membership, rules, and how it works.',
  openGraph: {
    title: 'FAQ | Bea Dating App',
    description: 'Frequently asked questions about Bea dating app.',
    type: 'website',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
