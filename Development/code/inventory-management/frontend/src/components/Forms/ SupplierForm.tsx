import { useState } from "react";
import api from "../../utils/ api";
interface SupplierFormProps {
  supplier?: any;
  onSuccess: () => void;
  onClose: () => void;
}

function SupplierForm({
  supplier,
  onSuccess,
  onClose,
}: SupplierFormProps) {
  const [name, setName] = useState(supplier?.name || "");
  const [phone, setPhone] = useState(supplier?.phone || "");
  const [email, setEmail] = useState(supplier?.email || "");
  const [address, setAddress] = useState(supplier?.address || "");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        name,
        phone,
        email,
        address,
      };

      if (supplier) {
        await api.put(`/suppliers/${supplier.id}`, data);
      } else {
        await api.post("/suppliers/", data);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Unable to save supplier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl p-6 w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-5">
          {supplier ? "Edit Supplier" : "Add Supplier"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Supplier Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            required
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-3"
            placeholder="Address"
            rows={3}
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading
                ? "Saving..."
                : supplier
                ? "Update"
                : "Save"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SupplierForm;