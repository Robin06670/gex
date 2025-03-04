import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    cabinetName: "",
    address: "",
    collaborators: "",
    phone: "",
    email: "",
    logo: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // Récupérer le token

  // ✅ Charger UNIQUEMENT les paramètres liés à l'utilisateur connecté
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login"); // Rediriger si non connecté
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/settings", {
          headers: { Authorization: token }
        });

        if (response.data) {
          setProfileData(response.data);
        }
      } catch (err) {
        console.error("❌ Erreur lors du chargement des paramètres :", err);
        setError("Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // ✅ Gestion des changements de champs
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // ✅ Gestion du logo (image en base64)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Sauvegarde des données dans MongoDB
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/settings", profileData, {
        headers: { Authorization: token }
      });
      alert("Modifications enregistrées !");
    } catch (err) {
      console.error("❌ Erreur lors de l'enregistrement :", err);
      alert("Une erreur est survenue !");
    }
  };

  // ✅ Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Paramètres</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
            <h3 className="text-xl font-semibold mb-4">Informations du Cabinet</h3>
            <input
              type="text"
              name="cabinetName"
              placeholder="Nom du cabinet"
              value={profileData.cabinetName}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="address"
              placeholder="Adresse"
              value={profileData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="number"
              name="collaborators"
              placeholder="Nombre de collaborateurs"
              value={profileData.collaborators}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="email"
              name="email"
              placeholder="Email professionnel"
              value={profileData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Logo */}
            <div>
              <label className="block text-gray-700 font-semibold">Logo du cabinet</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full p-2 border rounded" />
              {profileData.logo && (
                <img
                  src={profileData.logo}
                  alt="Logo Cabinet"
                  className="w-24 h-24 rounded-full shadow-lg object-cover mt-2"
                />
              )}
            </div>

            <button onClick={handleSave} className="mt-4 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
              Enregistrer les modifications
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={handleLogout} className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded w-40">
            Se Déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
