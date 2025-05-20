import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CONSTANTS } from "../utils/constant";
import { fetchWithErrorHandling } from "../utils/rest";
import toast from "react-hot-toast";

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    originalUrl: "",
    slug: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUri = async () => {
      try {
        const res = await fetch(`${CONSTANTS.API_DOMAIN}/api/uri/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();

        setForm({
          originalUrl: data.originalUrl || "",
          slug: data.slug || "",
          expiresAt: data.expiresAt
            ? new Date(data.expiresAt).toISOString().slice(0, 16)
            : "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch URI.");
        setLoading(false);
      }
    };

    fetchUri();
  }, [id]);

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
      await fetchWithErrorHandling(`${CONSTANTS.API_DOMAIN}/api/uri/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: form.originalUrl,
          slug: form.slug,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      toast.success("URL updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-xl mb-4">Edit Shortened URL</h1>
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
          <label className="block mb-1">Slug</label>
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
            className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPage;
