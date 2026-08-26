import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/ Register";
import Dashboard from "./pages/ Dashboard";
import Products from "./pages/ Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";

import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import StockReturned from "./pages/StockReturned";
import StockHistory from "./pages/StockHistory";

import NotFound from "./pages/NotFound";

import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route
          path="/"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />


        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />


        <Route
          path="/sales-history"
          element={
            <ProtectedRoute>
              <SalesHistory />
            </ProtectedRoute>
          }
        />


        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />


        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/stock-in"
          element={
            <ProtectedRoute>
              <StockIn />
            </ProtectedRoute>
          }
        />


        <Route
          path="/stock-out"
          element={
            <ProtectedRoute>
              <StockOut />
            </ProtectedRoute>
          }
        />


        <Route
          path="/stock-returned"
          element={
            <ProtectedRoute>
              <StockReturned />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-history"
          element={
            <ProtectedRoute>
              <StockHistory />
            </ProtectedRoute>
          }
        />


        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;