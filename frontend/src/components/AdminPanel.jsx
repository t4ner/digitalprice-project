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
    address: "",
    businessHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });
  const [businessName, setBusinessName] = useState("");

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
      const response = await fetch("http://165.232.76.29:8093/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newService),
      });

      if (!response.ok)
        throw new Error("Dienstleistung konnte nicht hinzugefügt werden");

      setSuccess("Dienstleistung erfolgreich hinzugefügt");
      setNewService({ name: "", price: "" });
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  // Logo'ları getir
  const fetchLogo = async () => {
    try {
      const response = await fetch("http://165.232.76.29:8093/api/user-logo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Logo konnte nicht geladen werden");

      const logoData = await response.json();
      setLogo(logoData);
    } catch (err) {
      console.error("Logo fetch error:", err);
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
      const response = await fetch("http://165.232.76.29:8093/api/upload-logo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Logo konnte nicht hochgeladen werden");

      const updatedLogo = await response.json();
      setLogo(updatedLogo);
      setSuccess("Logo erfolgreich hochgeladen");
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Logo silme fonksiyonu
  const handleDeleteLogo = async () => {
    try {
      const response = await fetch("http://165.232.76.29:8093/api/logo", {
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
      const response = await fetch("http://165.232.76.29:8093/api/services", {
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
        throw new Error("Dienstleistungen konnten nicht geladen werden");
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
      const response = await fetch("http://165.232.76.29:8093/api/social-media", {
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
        throw new Error("Soziale Medien Links konnten nicht geladen werden");
      }

      const data = await response.json();
      setSocialMedia({
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        instagram: data.instagram || "",
        googleMaps: data.googleMaps || "",
        address: data.address || "",
        businessHours: {
          monday: {
            open: data.businessHours?.monday?.open || "",
            close: data.businessHours?.monday?.close || "",
          },
          tuesday: {
            open: data.businessHours?.tuesday?.open || "",
            close: data.businessHours?.tuesday?.close || "",
          },
          wednesday: {
            open: data.businessHours?.wednesday?.open || "",
            close: data.businessHours?.wednesday?.close || "",
          },
          thursday: {
            open: data.businessHours?.thursday?.open || "",
            close: data.businessHours?.thursday?.close || "",
          },
          friday: {
            open: data.businessHours?.friday?.open || "",
            close: data.businessHours?.friday?.close || "",
          },
          saturday: {
            open: data.businessHours?.saturday?.open || "",
            close: data.businessHours?.saturday?.close || "",
          },
          sunday: {
            open: data.businessHours?.sunday?.open || "",
            close: data.businessHours?.sunday?.close || "",
          },
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Sosyal medya güncelleme fonksiyonunu güncelle
  const handleSocialMediaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://165.232.76.29:8093/api/social-media", {
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
        throw new Error(
          "Soziale Medien Links konnten nicht aktualisiert werden"
        );

      const data = await response.json();
      setSocialMedia(data);
      setSuccess("Soziale Medien Links erfolgreich aktualisiert");
    } catch (err) {
      setError(err.message);
    }
  };

  // Servis silme fonksiyonu
  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(
        `http://165.232.76.29:8093/api/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Dienstleistung konnte nicht gelöscht werden");
      }

      setSuccess("Dienstleistung erfolgreich gelöscht");
      fetchServices(); // Servisleri yeniden yükle
    } catch (err) {
      setError(err.message);
    }
  };

  // İşletme adı güncelleme fonksiyonu
  const handleBusinessNameUpdate = async () => {
    try {
      const response = await fetch("http://165.232.76.29:8093/api/business-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ businessName }),
      });

      if (!response.ok) {
        throw new Error("Geschäftsname konnte nicht aktualisiert werden");
      }

      setSuccess("Geschäftsname erfolgreich aktualisiert");
    } catch (err) {
      setError(err.message);
    }
  };

  // İşletme adını getirme fonksiyonu
  const fetchBusinessName = async () => {
    try {
      const response = await fetch("http://165.232.76.29:8093/api/business-name", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Geschäftsname konnte nicht geladen werden");
      }

      const data = await response.json();
      setBusinessName(data.businessName || "");
    } catch (err) {
      console.error("Business name fetch error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!checkAuth()) return;

    fetchServices();
    fetchLogo();
    fetchSocialMedia();
    fetchBusinessName();
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
            Verwaltungspanel
          </h1>
        </motion.div>

        {/* Logo and Service Form Container */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Logo Section */}
          <motion.div
            className="p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-md flex flex-col justify-center min-h-[400px]"
            variants={itemVariants}
          >
            <h2 className="mb-4 text-xl font-semibold text-white">Logo</h2>

            <div className="flex flex-col items-center justify-center flex-1 space-y-4">
              {logo && logo.fileId ? (
                <div className="flex flex-col items-center space-y-10">
                  <div className="relative">
                    <img
                      src={`http://165.232.76.29:8093/api/logo/${logo.fileId}`}
                      alt="Current Logo"
                      className="object-contain w-48 h-48 p-2 transition-transform duration-300 rounded-lg ring-2 ring-blue-400/50"
                    />
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <motion.button
                      onClick={handleDeleteLogo}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-colors bg-red-500 rounded-lg shadow-lg hover:bg-red-600"
                      title="Logo löschen"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="">Logo löschen</span>
                    </motion.button>
                    <p className="text-xs text-gray-500">
                      Löschen Sie das Logo, um ein neues hochzuladen
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-48 transition-colors duration-300 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-800/30 hover:bg-gray-800/50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="px-2 mb-2 text-sm text-gray-400">
                          <span className="font-semibold">
                            Klicken Sie zum Hochladen
                          </span>{" "}
                          oder ziehen Sie eine Datei hierher
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="hidden"
                        disabled={logo && logo.fileId}
                      />
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
                        <span className="text-sm text-gray-300 truncate">
                          {selectedFile.name}
                        </span>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogoUpload}
                        className="w-full px-4 py-2 mt-2 text-white transition-colors duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        Logo hochladen
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Service Form */}
          <motion.div
            className="p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
            variants={itemVariants}
          >
            <h2 className="mb-6 text-xl font-semibold text-white">
              Dienstleistung hinzufügen
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
                className="w-full px-6 py-3 mb-6 text-white transition-colors bg-green-500 rounded-lg shadow-lg hover:bg-green-600"
              >
                Dienstleistung hinzufügen
              </motion.button>
            </form>

            {/* İşletme Adı Alanı */}
            <div className="pt-6 mt-6 border-t border-gray-700">
              <h3 className="mb-4 text-lg font-medium text-white">
                Geschäftsname
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Geben Sie Ihren Geschäftsnamen ein"
                />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBusinessNameUpdate}
                  className="w-full px-6 py-3 text-white transition-colors bg-green-500 rounded-lg shadow-lg hover:bg-green-600"
                >
                  Geschäftsname aktualisieren
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Media Section */}

        {/* Services List */}
        <motion.div
          className="p-6 mt-8 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
          variants={itemVariants}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Aktuelle Dienstleistungen
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
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      title="Service löschen"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
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
            Kontaktdaten & Öffnungszeiten
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
                  placeholder="XXX XXXXXXXX"
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
                  placeholder="XXX XXXXXXXX"
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

            {/* Adres alanı */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Adresse
              </label>
              <textarea
                value={socialMedia.address}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, address: e.target.value })
                }
                className="w-full px-4 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            {/* Çalışma saatleri */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Öffnungszeiten</h3>
              {Object.entries(socialMedia.businessHours).map(([day, hours]) => (
                <div key={day} className="grid items-center grid-cols-3 gap-4">
                  <span className="text-gray-300 capitalize">
                    {day === "monday" && "Montag"}
                    {day === "tuesday" && "Dienstag"}
                    {day === "wednesday" && "Mittwoch"}
                    {day === "thursday" && "Donnerstag"}
                    {day === "friday" && "Freitag"}
                    {day === "saturday" && "Samstag"}
                    {day === "sunday" && "Sonntag"}
                  </span>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) =>
                      setSocialMedia({
                        ...socialMedia,
                        businessHours: {
                          ...socialMedia.businessHours,
                          [day]: { ...hours, open: e.target.value },
                        },
                      })
                    }
                    className="px-3 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) =>
                      setSocialMedia({
                        ...socialMedia,
                        businessHours: {
                          ...socialMedia.businessHours,
                          [day]: { ...hours, close: e.target.value },
                        },
                      })
                    }
                    className="px-3 py-2 text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full px-6 py-3 text-white transition-colors bg-green-500 rounded-lg shadow-lg hover:bg-green-600"
            >
              Aktualisieren
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
