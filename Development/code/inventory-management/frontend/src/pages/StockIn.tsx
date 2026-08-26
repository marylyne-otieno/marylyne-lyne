import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import api from "../utils/ api";

interface Product {
  id: number;
  name: string;
}

function StockIn() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/stock/stock/in", {
        product_id: Number(productId),
        quantity: Number(quantity),
      });

      alert("Stock added successfully");

      setProductId("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to add stock");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Stock In</h1>

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

        <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
          Add Stock
        </button>
      </form>
    </DashboardLayout>
  );
}

export default StockIn;