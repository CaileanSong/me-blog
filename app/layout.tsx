import ThemeShell from './ui/theme-shell';
import './ui/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeShell>{children}</ThemeShell>
      </body>
    </html>
  );
}
