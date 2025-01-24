import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  GiRazor,
  GiBeard,
  GiScissors,
  GiRazorBlade,
  GiComb,
} from "react-icons/gi";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full backdrop-blur-sm">
        <div className="max-w-4xl px-4 py-8 mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            {themeData.logo && themeData.logo.fileId ? (
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-zinc-500/30 blur-xl"></div>
                <div className="relative z-10 p-[4px] rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                  <div className="rounded-full bg-[#1A1A1D] p-3">
                    <div className="relative flex items-center justify-center w-56 h-56 overflow-hidden rounded-full">
                      <img
                        src={`http://localhost:3000/api/logo/${themeData.logo.fileId}`}
                        alt="Berber Salonu Logo"
                        className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-zinc-500/30 blur-xl"></div>
                <div className="relative z-10 p-[4px] rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                  <div className="flex items-center justify-center rounded-full bg-[#1A1A1D] p-1">
                    <div className="flex items-center justify-center w-48 h-48 transition-transform duration-300 rounded-full shadow-2xl hover:scale-105">
                      <span className="text-5xl font-bold text-amber-500/80">
                        {themeData.user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shop Name */}
            <h1 className="py-2 mt-2 text-xl font-bold text-center text-transparent mb- md:text-5xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text">
              {themeData.user.name}
            </h1>

            {/* Decorative Line */}
            <div className="flex items-center justify-center w-full gap-4 mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
              <GiRazor
                className="text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text"
                size={30}
              />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-4xl px-4 mx-auto">
        <div className="relative px-2 py-6 bg-black/20 backdrop-blur-lg rounded-2xl">
          {/* Section Title */}
          <div className="flex items-center justify-center mb-10 space-x-4">
            <GiScissors className="text-amber-400" size={28} />
            <h2 className="text-xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text">
              Preisliste
            </h2>
            <GiComb className="text-amber-400" size={28} />
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence>
              {themeData.services.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="relative p-4 transition-all duration-300 border group hover:bg-white/5 rounded-xl border-amber-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GiRazorBlade
                        className="transition-transform duration-300 text-amber-400 group-hover:rotate-45"
                        size={20}
                      />
                      <div>
                        <h3 className="text-sm font-medium text-white md:text-lg">
                          {service.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-transparent md:text-xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text">
                      {service.price}€
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex justify-center gap-8 px-4 py-8 ">
          {themeData.socialMedia.phone && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={`tel:${themeData.socialMedia.phone}`}
              className="p-4 transition-colors rounded-full bg-white/5 hover:bg-amber-500/20"
            >
              <FaPhone className="text-amber-400" size={24} />
            </motion.a>
          )}
          {themeData.socialMedia.whatsapp && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={`https://wa.me/${themeData.socialMedia.whatsapp.replace(
                /\+/g,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 transition-colors rounded-full bg-white/5 hover:bg-amber-500/20"
            >
              <FaWhatsapp className="text-amber-400" size={24} />
            </motion.a>
          )}
          {themeData.socialMedia.instagram && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={themeData.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 transition-colors rounded-full bg-white/5 hover:bg-amber-500/20"
            >
              <FaInstagram className="text-amber-400" size={24} />
            </motion.a>
          )}
          {themeData.socialMedia.googleMaps && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={themeData.socialMedia.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 transition-colors rounded-full bg-white/5 hover:bg-amber-500/20"
            >
              <FaMapMarkerAlt className="text-amber-400" size={24} />
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Theme;
