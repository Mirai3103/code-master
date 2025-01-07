import Header from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh">
      <Header />

      <main className="">{children}</main>
    </div>
  );
}
