import StyledComponentsRegistry from '@lib/registry';
import { Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const ah = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={ah.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}