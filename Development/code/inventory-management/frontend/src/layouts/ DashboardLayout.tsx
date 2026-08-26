import type { ReactNode } from "react";

import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex">

      <aside className="w-64 bg-blue-700 text-white">

        <div className="p-6 text-2xl font-bold border-b border-blue-600">
          Inventory
        </div>

        <nav className="p-5 space-y-3">

          <Link
            to="/dashboard"
            className="block hover:bg-blue-600 rounded p-3"
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            className="block hover:bg-blue-600 rounded p-3"
          >
            Products
          </Link>

          <Link
            to="/categories"
            className="block hover:bg-blue-600 rounded p-3"
          >
            Categories
          </Link>

          <Link
            to="/suppliers"
            className="block hover:bg-blue-600 rounded p-3"
          >
            Suppliers
          </Link>



          <div className="pt-4">

            <p className="px-3 mb-2 text-sm font-semibold text-blue-200 uppercase">
              Stock Management
            </p>

            <Link
              to="/stock-in"
              className="block hover:bg-blue-600 rounded p-3"
            >
              Add Stock
            </Link>

            <Link
              to="/stock-out"
              className="block hover:bg-blue-600 rounded p-3"
            >
              Remove Stock
            </Link>

            <Link
              to="/stock-returned"
              className="block hover:bg-blue-600 rounded p-3"
            >
              Returned Stock
            </Link>

            <Link
              to="/stock-history"
              className="block hover:bg-blue-600 rounded p-3"
            >
              Stock History
            </Link>

          </div>



          <div className="pt-4">

            <p className="px-3 mb-2 text-sm font-semibold text-blue-200 uppercase">
              Sales
            </p>

            <Link
              to="/sales"
              className="block hover:bg-blue-600 rounded p-3"
            >
              Record Sale
            </Link>

            <Link
              to="/sales-history"
              className="block hover:bg-blue-600 rounded p-3"
            >
              Sales History
            </Link>

          </div>

        </nav>

      </aside>

      {/* Main Section */}
      <div className="flex-1 bg-gray-100">

        {/* Navbar */}
        <header className="bg-white shadow px-8 py-5 flex justify-between">

          <h1 className="text-2xl font-bold">
            Inventory Management System
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>

        </header>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;