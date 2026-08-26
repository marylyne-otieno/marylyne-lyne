import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/ DashboardLayout";

import api from "../utils/ api";

interface Product {
  id: number;
  name: string;
  quantity: number;
}

function ReturnedStock() {
  const [products, setProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");



  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");

      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };



  const selectedProduct = products.find(
    (product) => product.id === Number(productId)
  );



  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !quantity) {
      alert("Product and quantity are required.");
      return;
    }

    if (Number(quantity) <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    try {
      const res = await api.post("/stock/return", {
        product_id: Number(productId),
        quantity: Number(quantity),
        reason: reason,
      });

      alert(res.data.message);

      // Reset form
      setProductId("");
      setQuantity("");
      setReason("");

      fetchProducts();

    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to record returned stock."
      );
    }
  };

  return (
    <DashboardLayout>



      <h1 className="text-3xl font-bold mb-6">
        Returned Stock
      </h1>



      <div className="bg-white rounded-xl shadow p-6 max-w-xl">

        <h2 className="text-xl font-bold mb-5">
          Record Returned Stock
        </h2>

        <form onSubmit={handleReturn}>


          <div className="mb-4">

            <label className="block font-medium mb-2">
              Product
            </label>

            <select
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
              className="w-full border rounded-lg p-3"
              required
            >

              <option value="">
                Select Product
              </option>

              {products.map((product) => (

                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} ({product.quantity} in stock)
                </option>

              ))}

            </select>

          </div>


          <div className="mb-4">

            <label className="block font-medium mb-2">
              Returned Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="w-full border rounded-lg p-3"
              placeholder="Enter quantity"
              required
            />

          </div>


          <div className="mb-4">

            <label className="block font-medium mb-2">
              Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              className="w-full border rounded-lg p-3"
              placeholder="Example: Customer returned product"
              rows={3}
            />

          </div>


          {selectedProduct && quantity && (
            <div className="bg-gray-100 rounded-lg p-4 mb-5">

              <p>
                Current Stock:{" "}
                <span className="font-bold">
                  {selectedProduct.quantity}
                </span>
              </p>

              <p className="mt-2">
                Stock After Return:{" "}
                <span className="font-bold">
                  {selectedProduct.quantity +
                    Number(quantity)}
                </span>
              </p>

            </div>
          )}


          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Record Returned Stock
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default ReturnedStock;