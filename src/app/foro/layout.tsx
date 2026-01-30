import QueryClientProvider from '@/components/providers/QueryClientProvider';
import ReactQueryReady from '@/components/providers/TanStackProvider'; 

export default function ForoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider>
      <ReactQueryReady /> 
      {children}
    </QueryClientProvider>
  );
}