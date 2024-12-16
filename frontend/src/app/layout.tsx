import { WorkflowProvider } from '@/contexts/WorkflowContext';
import { WorkflowNavigationProvider } from '@/contexts/WorkflowNavigationContext';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Loyalty Program Designer',
  description: 'Design and evaluate loyalty programs tailored to your business needs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WorkflowProvider>
          <WorkflowNavigationProvider>
            {children}
          </WorkflowNavigationProvider>
        </WorkflowProvider>
      </body>
    </html>
  );
}