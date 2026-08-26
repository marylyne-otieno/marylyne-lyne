import { useEffect, useState, type FormEvent } from "react";
import api from "../../utils/ api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id?: number;
  name: string;
  brand?: string;
  sku: string;
  barcode?: string;
  buying_price: number;
  selling_price: number;
  quantity: number;
  minimum_stock: number;
  expiry_date?: string | null;
  category_id: number;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onClose: () => void;
}

function ProductForm({
  product,
  onSuccess,
  onClose,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    buying_price: product?.buying_price || 0,
    selling_price: product?.selling_price || 0,
    quantity: product?.quantity || 0,
    minimum_stock: product?.minimum_stock || 5,
    expiry_date: product?.expiry_date
      ? product.expiry_date.split("T")[0]
      : "",
    category_id: product?.category_id || 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        brand: formData.brand || null,
        barcode: formData.barcode || null,
        expiry_date: formData.expiry_date || null,
      };

      if (product) {
        await api.put(
          `/products/${product.id}`,
          dataToSend
        );

        alert("Product updated successfully.");
      } else {
        await api.post(
          "/products/",
          dataToSend
        );

        alert("Product added successfully.");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
<div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] flex flex-col">

        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {product ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-red-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Brand
              </label>

              <input
                type="text"
                name="brand"
                placeholder="Example: Samsung, Nike, Coca-Cola"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU / Product Code
                </label>

                <input
                  type="text"
                  name="sku"
                  placeholder="Example: SAM-001"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>

                <input
                  type="text"
                  name="barcode"
                  placeholder="Scan or enter barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buying Price
                </label>

                <input
                  type="number"
                  name="buying_price"
                  placeholder="Enter buying price"
                  value={formData.buying_price}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price
                </label>

                <input
                  type="number"
                  name="selling_price"
                  placeholder="Enter selling price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level
                </label>

                <input
                  type="number"
                  name="minimum_stock"
                  placeholder="Enter minimum stock level"
                  value={formData.minimum_stock}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                  min="0"
                />
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>

              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <p className="text-xs text-gray-500 mt-1">
                Leave empty if the product does not expire.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >
                <option value={0}>
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4 pb-2">

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : product
                  ? "Update Product"
                  : "Save Product"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;