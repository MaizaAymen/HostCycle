import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faSearch } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Chat/Chat1";
import Aymen from "../dash/header";

const WebsitesList = () => {
  const [websites, setWebsites] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch all websites
  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://host-cycle-ji9x-aymens-projects-9ad69811.vercel.app/api/user/getAllWebsites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API Response:", response.data); // Vérifier la structure des données

      if (response.data.success && response.data.websites) {
        setWebsites(response.data.websites);
        setFilteredWebsites(response.data.websites);
      } else {
        setError("No websites found");
      }
      
    } catch (error) {
      console.error("Error fetching websites:", error);
      setError("Failed to fetch websites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    const filtered = websites.filter((website) =>
      website.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWebsites(filtered);
  }, [searchTerm, websites]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Aymen />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-4 md:p-8 sm:ml-64">
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center p-2 text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">Toggle Sidebar</span>
            <FontAwesomeIcon icon={faGlobe} className="w-6 h-6" />
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">All Websites</h1>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search websites by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:border-blue-500 focus:ring"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 mb-4">{error}</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Website Name</th>
                      <th scope="col" className="px-6 py-3">Owner</th>
                      <th scope="col" className="px-6 py-3">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWebsites.map((website) => (
                      <tr key={website._id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{website.name}</td>
                        <td className="px-6 py-4">{website.owner}</td>
                        <td className="px-6 py-4">
                          <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {website.url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsitesList;
