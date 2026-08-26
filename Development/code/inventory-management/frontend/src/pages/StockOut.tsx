import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import api from "../utils/ api";

interface Product {
  id: number;
  name: string;
}

function StockOut() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products/");
    setProducts(res.data.products);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/stock/stock/out", {
        product_id: Number(productId),
        quantity: Number(quantity),
      });

      alert("Stock removed successfully");

      setProductId("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to remove stock");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Stock Out</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 max-w-xl"
      >
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Product
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Quantity
          </label>

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className="bg-red-600 text-white px-6 py-3 rounded-lg">
          Remove Stock
        </button>
      </form>
    </DashboardLayout>
  );
}

export default StockOut;