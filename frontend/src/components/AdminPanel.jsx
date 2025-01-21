import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [logo, setLogo] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [socialMedia, setSocialMedia] = useState({
    phone: "",
    whatsapp: "",
    instagram: "",
    googleMaps: "",
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  // Token kontrolü
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return false;
    }
    try {
      // Token'ın geçerliliğini kontrol et
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
      return false;
    }
  };

  // Token'dan user bilgisini çıkaran yardımcı fonksiyon
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      return null;
    }
  };

  // Servis ekleme
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newService),
      });

      if (!response.ok)
        throw new Error("Service konnte nicht hinzugefügt werden");

      setSuccess("Service erfolgreich hinzugefügt");
      setNewService({ name: "", price: "" });
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  // Logo'ları getir
  const fetchLogo = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch("http://localhost:3000/api/logo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Logo konnte nicht geladen werden");
      }

      const data = await response.json();
      setLogo(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Logo yükleme
  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("logo", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/api/upload-logo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Logo konnte nicht hochgeladen werden");

      setSuccess("Logo erfolgreich hochgeladen");
      setSelectedFile(null);
      fetchLogo();
    } catch (err) {
      setError(err.message);
    }
  };

  // Logo silme fonksiyonu
  const handleDeleteLogo = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/logo", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Logo konnte nicht gelöscht werden");
      }

      setLogo(null);
      setSuccess("Logo erfolgreich gelöscht");
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Servisleri getir
  const fetchServices = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch("http://localhost:3000/api/services", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Services konnten nicht geladen werden");
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Sosyal medya verilerini getirme fonksiyonunu güncelle
  const fetchSocialMedia = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch("http://localhost:3000/api/social-media", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Social Media Links konnten nicht geladen werden");
      }

      const data = await response.json();
      setSocialMedia({
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        instagram: data.instagram || "",
        googleMaps: data.googleMaps || "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Sosyal medya güncelleme fonksiyonunu güncelle
  const handleSocialMediaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/social-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...socialMedia,
          user: getUserFromToken()?.userId, // user ID'yi ekle
        }),
      });

      if (!response.ok)
        throw new Error("Social Media Links konnten nicht aktualisiert werden");

      const data = await response.json();
      setSocialMedia(data);
      setSuccess("Social Media Links erfolgreich aktualisiert");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!checkAuth()) return;

    fetchServices();
    fetchLogo();
    fetchSocialMedia();
  }, [navigate]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      console.log("Current user:", user);
    }
  }, []);

  return (
    <div className="min-h-screen p-8 ">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          className="flex items-center justify-between p-6 mb-8 rounded-lg bg-white/10 backdrop-blur-md"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
            Admin Panel
          </h1>
          
        </motion.div>

        {/* Logo and Service Form Container */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Logo Section */}
          <motion.div
            className="p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
            variants={itemVariants}
          >
            <h2 className="mb-4 text-xl font-semibold text-white">Logo</h2>

            <AnimatePresence mode="wait">
              {logo && logo.imageUrl ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mb-4"
                >
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={`http://localhost:3000${logo.imageUrl}`}
                      alt="Current Logo"
                      className="object-contain w-48 h-48 rounded-lg ring-2 ring-blue-400/50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteLogo}
                      className="px-4 py-2 text-white transition-colors bg-red-500 rounded-lg shadow-lg hover:bg-red-600"
                    >
                      Logo löschen
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="upload"
                  onSubmit={handleLogoUpload}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Logo hochladen
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="block w-full text-gray-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none"
                      accept="image/*"
                    />
                  </div>
                  {selectedFile && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
                    >
                      Logo hochladen
                    </motion.button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Service Form */}
          <motion.div
            className="p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
            variants={itemVariants}
          >
            <h2 className="mb-6 text-xl font-semibold text-white">
              Service hinzufügen
            </h2>
            <form onSubmit={handleServiceSubmit}>
              <div className="grid gap-6 mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Dienstname
                  </label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Preis (€)
                  </label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({ ...newService, price: e.target.value })
                    }
                    className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-6 py-3 text-white transition-colors bg-green-500 rounded-lg shadow-lg hover:bg-green-600"
              >
                Service hinzufügen
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Social Media Section */}

        {/* Services List */}
        <motion.div
          className="p-6 mt-8 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
          variants={itemVariants}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Aktuelle Services
          </h2>
          <div className="space-y-4">
            <AnimatePresence>
              {services.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 transition-colors rounded-lg bg-gray-800/50 hover:bg-gray-700/50"
                >
                  <div>
                    <h3 className="font-medium text-white">{service.name}</h3>
                  </div>
                  <p className="font-medium text-green-400">{service.price}€</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="p-6 mt-8 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
          variants={itemVariants}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Social Media Links
          </h2>
          <form onSubmit={handleSocialMediaSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={socialMedia.phone}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+49 123 456789"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={socialMedia.whatsapp}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, whatsapp: e.target.value })
                  }
                  className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+49 123 456789"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Instagram
                </label>
                <input
                  type="url"
                  value={socialMedia.instagram}
                  onChange={(e) =>
                    setSocialMedia({
                      ...socialMedia,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Google Maps
                </label>
                <input
                  type="url"
                  value={socialMedia.googleMaps}
                  onChange={(e) =>
                    setSocialMedia({
                      ...socialMedia,
                      googleMaps: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full px-6 py-3 text-white transition-colors bg-green-500 rounded-lg shadow-lg hover:bg-green-600"
            >
              Social Media Links aktualisieren
            </motion.button>
          </form>
        </motion.div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 mt-4 text-red-200 rounded-lg bg-red-900/50 backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 mt-4 text-green-200 rounded-lg bg-green-900/50 backdrop-blur-md"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
