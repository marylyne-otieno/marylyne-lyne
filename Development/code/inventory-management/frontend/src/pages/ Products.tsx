import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import ProductForm from "../components/Products/ProductForm";
import api from "../utils/ api";

interface Product {
  id: number;
  name: string;
  description: string;
  buying_price: number;
  selling_price: number;
  quantity: number;
  minimum_stock: number;
  image: string;
  category_id: number;

  sku: string;
  barcode: string;
  brand: string;
  expiry_date: string | null;
  updated_at: string | null;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products/");

      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product deleted successfully.");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchValue) ||
      product.sku?.toLowerCase().includes(searchValue) ||
      product.barcode?.toLowerCase().includes(searchValue) ||
      product.brand?.toLowerCase().includes(searchValue)
    );
  });

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);

    return expiry < today;
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;

    const today = new Date();

    const expiry = new Date(expiryDate);

    const difference =
      expiry.getTime() - today.getTime();

    const days =
      difference / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 30;
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your inventory products
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by product, SKU, barcode or brand..."
        className="w-full md:w-96 border rounded-lg p-3 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">
          Loading products...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full min-w-350">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  Brand
                </th>

                <th className="p-4 text-left">
                  SKU
                </th>

                <th className="p-4 text-left">
                  Barcode
                </th>

                <th className="p-4 text-left">
                  Buying Price
                </th>

                <th className="p-4 text-left">
                  Selling Price
                </th>

                <th className="p-4 text-left">
                  Quantity
                </th>

                <th className="p-4 text-left">
                  Expiry Date
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4">
                    {product.brand || "—"}
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {product.sku}
                    </span>
                  </td>

                  <td className="p-4">
                    {product.barcode ? (
                      <span className="font-mono text-sm">
                        {product.barcode}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-4">
                    KSh{" "}
                    {Number(product.buying_price).toFixed(2)}
                  </td>

                  <td className="p-4">
                    KSh{" "}
                    {Number(product.selling_price).toFixed(2)}
                  </td>

                  <td className="p-4">
                    {product.quantity}
                  </td>

                  <td className="p-4">
                    {!product.expiry_date ? (
                      <span className="text-gray-400">
                        No expiry
                      </span>
                    ) : isExpired(product.expiry_date) ? (
                      <div>
                        <span className="text-red-600 font-semibold">
                          {product.expiry_date}
                        </span>

                        <div className="text-xs text-red-500">
                          Expired
                        </div>
                      </div>
                    ) : isExpiringSoon(
                        product.expiry_date
                      ) ? (
                      <div>
                        <span className="text-orange-600 font-semibold">
                          {product.expiry_date}
                        </span>

                        <div className="text-xs text-orange-500">
                          Expiring soon
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-700">
                        {product.expiry_date}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {product.quantity <=
                    product.minimum_stock ? (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-sm font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-600 text-sm font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center p-6 text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchProducts();
            setShowForm(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default Products;