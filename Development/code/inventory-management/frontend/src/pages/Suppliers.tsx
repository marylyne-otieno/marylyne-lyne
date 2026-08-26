import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import SupplierForm from "../components/Forms/ SupplierForm";
import api from "../utils/ api";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers/");
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error("Error loading suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSupplier(null);
    setShowForm(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete supplier.");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Suppliers
        </h1>

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Supplier
        </button>

      </div>

      <input
        type="text"
        placeholder="Search supplier..."
        className="w-full md:w-80 border rounded-lg p-3 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredSuppliers.map((supplier) => (

                <tr
                  key={supplier.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {supplier.name}
                  </td>

                  <td className="p-4">
                    {supplier.phone}
                  </td>

                  <td className="p-4">
                    {supplier.email}
                  </td>

                  <td className="p-4">
                    {supplier.address}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

              {filteredSuppliers.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500"
                  >
                    No suppliers found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>
      )}

      {showForm && (
        <SupplierForm
          supplier={selectedSupplier}
          onClose={() => setShowForm(false)}
          onSuccess={fetchSuppliers}
        />
      )}

    </DashboardLayout>
  );
}

export default Suppliers;