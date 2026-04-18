export default function ShopPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Shop {params.id}</h1>
      <p>Loading shop details...</p>
    </div>
  );
}
