import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "Verifying your email..." : "Verification token is missing.",
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const runVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Email verified successfully.");
        toast.success("Email verified");
        setTimeout(() => navigate("/dashboard", { replace: true }), 1200);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Unable to verify this email link.",
        );
      }
    };

    runVerification();
  }, [navigate, token, verifyEmail]);

  return (
    <main className="app-bg min-h-screen">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="surface shadow-app w-full max-w-md rounded border border-subtle p-6 text-center">
          <p className="text-sm text-blue-400">Email verification</p>
          <h1 className="text-primary mt-2 text-2xl font-semibold">
            {status === "success"
              ? "You're verified"
              : status === "error"
                ? "Verification failed"
                : "Checking your link"}
          </h1>
          <p className="text-muted mt-3 text-sm leading-6">{message}</p>

          {status === "error" && (
            <Link
              to="/dashboard"
              className="mt-6 inline-flex rounded bg-active px-4 py-2 text-sm font-semibold text-on-active transition hover:opacity-90"
            >
              Back to dashboard
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
