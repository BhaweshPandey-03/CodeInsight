import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await register(form);
      toast.success("Account created");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-bg min-h-screen">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="surface shadow-app w-full max-w-md rounded border border-subtle p-6">
          <div className="mb-6">
            <p className="text-sm text-blue-300">Create account</p>
            <h1 className="text-primary mt-2 text-2xl font-semibold">
              Start reviewing code
            </h1>
            <p className="text-muted mt-2 text-sm leading-6">
              Build your CodeInsight workspace in a few seconds.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-secondary text-sm">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="input-field mt-2 w-full rounded border px-3 py-3 text-sm outline-none transition"
                placeholder="Bhawesh Pandey"
              />
            </label>

            <label className="block">
              <span className="text-secondary text-sm">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="input-field mt-2 w-full rounded border px-3 py-3 text-sm outline-none transition"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-secondary text-sm">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                className="input-field mt-2 w-full rounded border px-3 py-3 text-sm outline-none transition"
                placeholder="Create a password"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-active px-4 py-3 text-sm font-semibold text-on-active transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-muted mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
