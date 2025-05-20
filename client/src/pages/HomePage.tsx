import { Link } from "react-router-dom"; // ✅ correct import
import reactLogo from "../assets/react.svg";

function HomePage() {
  return (
    <div className="h-screen bg-black flex justify-center items-center flex-col space-x-4 text-white">
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} alt="React logo" className="w-36 h-36" />
        </a>
      </div>
      <h1>Symph coding assignment page 1</h1>

      <div className="py-4">
        <Link to="/second" className="text-blue-400 underline block mb-2">
          Go to second page
        </Link>

        <Link to="/dashboard" className="text-green-400 underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
