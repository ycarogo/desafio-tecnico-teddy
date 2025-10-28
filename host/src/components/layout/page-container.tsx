export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background p-4 max-w-[1440px] w-full h-full mx-auto relative">
      {children}
    </div>
  );
}
