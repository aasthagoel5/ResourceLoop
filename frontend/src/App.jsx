import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <h1 className="text-4xl font-bold text-blue-600">ResourceLoop 🔵</h1>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
