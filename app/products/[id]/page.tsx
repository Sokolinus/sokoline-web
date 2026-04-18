export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Product {params.id}</h1>
      <p>Loading product details...</p>
    </div>
  );
}
