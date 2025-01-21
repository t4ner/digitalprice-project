import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Theme = () => {
  const { username } = useParams();
  const [themeData, setThemeData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/theme/${username}`
        );

        if (!response.ok) {
          throw new Error("Benutzer nicht gefunden");
        }

        const data = await response.json();
        setThemeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThemeData();
  }, [username]);

  if (loading) {
    return <div className="min-h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen text-white">{error}</div>;
  }

  if (!themeData) {
    return (
      <div className="min-h-screen text-white">Benutzer nicht gefunden</div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black">
      <div className="max-w-2xl p-4 mx-auto">
        {/* Logo Section */}
        <div className="flex justify-center pt-8 mb-8">
          {themeData.logo && themeData.logo.imageUrl ? (
            <img
              src={`http://localhost:3000${themeData.logo.imageUrl}`}
              alt="Barber Shop Logo"
              className="object-contain w-32 h-32"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-800 rounded-full" />
          )}
        </div>

        {/* Shop Name */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold">{themeData.user.name}</h1>
        </div>

        {/* Services List */}
        <div className="mb-12 space-y-6">
          <AnimatePresence>
            {themeData.services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="w-2 h-2 mr-3 bg-white rounded-full"></span>
                  <span className="text-lg">{service.name}</span>
                </div>
                <span className="text-lg">{service.price}€</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-800">
          {themeData.socialMedia.phone && (
            <a
              href={`tel:${themeData.socialMedia.phone}`}
              className="text-white"
            >
              <FaPhone size={24} />
            </a>
          )}
          {themeData.socialMedia.whatsapp && (
            <a
              href={`https://wa.me/${themeData.socialMedia.whatsapp.replace(
                /\+/g,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaWhatsapp size={24} />
            </a>
          )}
          {themeData.socialMedia.instagram && (
            <a
              href={themeData.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaInstagram size={24} />
            </a>
          )}
          {themeData.socialMedia.googleMaps && (
            <a
              href={themeData.socialMedia.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaMapMarkerAlt size={24} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Theme;
