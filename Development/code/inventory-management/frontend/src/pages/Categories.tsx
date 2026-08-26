import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import CategoryForm from "../components/Forms/CategoryForm";
import api from "../utils/ api";

interface category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

function Categories() {
  const [categories, setCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/category/categories");

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/category/categories/${id}`);

      alert("Category deleted successfully.");

      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        className="w-full md:w-80 border rounded-lg p-3 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">
          Loading categories...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {category.name}
                  </td>

                  <td className="p-4">
                    {category.description || "-"}
                  </td>

                  <td className="p-4">
                    {new Date(
                      category.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCategory(category.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchCategories();
            setShowForm(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default Categories;