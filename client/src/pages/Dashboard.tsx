import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import reactLogo from "../assets/react.svg";
import { CONSTANTS } from "../utils/constant";
import { fetchWithErrorHandling } from "../utils/rest";
import toast from "react-hot-toast";

interface Uri {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

function Dashboard() {
  const [uris, setUris] = useState<Uri[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUris = async (pageNumber = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${CONSTANTS.API_DOMAIN}/api/uri?page=${pageNumber}&limit=${limit}`
      );
      const data = await res.json();
      setUris(data.results || []);
      setTotalPages(data.totalPages || 1); // optional
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load data.");
      setLoading(false);
    }
  };

  const deleteUri = async (id: string) => {
    await fetchWithErrorHandling(`${CONSTANTS.API_DOMAIN}/api/uri/${id}`, {
      method: "DELETE",
    });
    toast.success("URL deleted successfully!");
    fetchUris(page, CONSTANTS.PAGINATION_LIMIT);
  };

  useEffect(() => {
    fetchUris(page, CONSTANTS.PAGINATION_LIMIT);
  }, [page]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} alt="React logo" className="w-16 h-16" />
        </a>
        <Link
          to="/create"
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          + Create New
        </Link>
      </div>

      <h1 className="text-2xl mt-6 mb-4">Shortened URLs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : uris.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <>
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Original URL</th>
                <th className="px-4 py-2">Short URL</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uris.map((uri) => (
                <tr
                  key={uri.id}
                  className="bg-gray-900 text-white hover:bg-gray-800 transition rounded shadow-sm"
                >
                  <td className="px-4 py-2 font-mono text-green-400">
                    {uri.slug}
                  </td>
                  <td className="px-4 py-2 truncate max-w-xs font-mono text-blue-300">
                    {uri.originalUrl}
                  </td>
                  <td className="px-4 py-2 font-mono">
                    <a
                      href={uri.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline hover:text-cyan-300"
                    >
                      {uri.shortUrl}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-400">
                    {new Date(uri.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/edit/${uri.id}`}
                      className="text-yellow-400 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteUri(uri.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 text-gray-300">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={uris.length < CONSTANTS.PAGINATION_LIMIT} // or page === totalPages if you return that
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
