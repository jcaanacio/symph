import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CONSTANTS } from "../utils/constant";
import { fetchWithErrorHandling } from "../utils/rest";
import toast from "react-hot-toast";

function generateSlug(): string {
  return uuidv4().replace(/-/g, "").slice(0, 8);
}

function CreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    originalUrl: "",
    slug: generateSlug(),
    expiresAt: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate original URL
    try {
      new URL(form.originalUrl);
    } catch (_) {
      return setError("Please enter a valid URL.");
    }

    // Validate slug
    if (form.slug && !/^[a-zA-Z0-9_-]{4,16}$/.test(form.slug)) {
      return setError("Slug must be 4–16 characters and alphanumeric.");
    }

    // Validate expiration date
    if (form.expiresAt && new Date(form.expiresAt) <= new Date()) {
      return setError("Expiration date must be in the future.");
    }

    try {
      await fetchWithErrorHandling(`${CONSTANTS.API_DOMAIN}/api/uri`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: form.originalUrl,
          slug: form.slug || undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      toast.success("URL created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-xl mb-4">Create New Shortened URL</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Original URL</label>
          <input
            type="url"
            name="originalUrl"
            required
            className="w-full p-2 text-black"
            value={form.originalUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">Custom Slug (optional)</label>
          <input
            type="text"
            name="slug"
            className="w-full p-2 text-black"
            value={form.slug}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">Expiration Date (optional)</label>
          <input
            type="datetime-local"
            name="expiresAt"
            className="w-full p-2 text-black"
            value={form.expiresAt}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-red-400">{error}</p>}

        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>

          <button
            type="submit"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;
