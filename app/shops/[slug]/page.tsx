export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Shop {slug}</h1>
      <p>Loading shop details...</p>
    </div>
  );
}
