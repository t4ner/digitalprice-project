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
          `http://165.232.76.29:8093/api/theme/${username}`
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
    return <div className="min-h-screen text-white bg-black">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen text-white">{error}</div>;
  }

  if (!themeData) {
    return (
      <div className="min-h-screen text-white">Benutzer nicht gefunden</div>
    );
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen text-gray-100 bg-black">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerAnimation}
        className="relative w-full py-12 md:py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent"></div>
        <div className="relative max-w-5xl px-4 mx-auto">
          <motion.div
            variants={itemAnimation}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            {themeData.logo && themeData.logo.fileId ? (
              <div className="relative mb-6 md:mb-8">
                <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-2xl"></div>
                <div className="relative">
                  <div className="p-[1px] rounded-full bg-gradient-to-r from-amber-400/80 to-amber-600/80">
                    <div className="p-1 rounded-full bg-zinc-900">
                      <div className="w-40 h-40 overflow-hidden rounded-full md:w-[300px] md:h-[300px]">
                        <img
                          src={`http://165.232.76.29:8093/api/logo/${themeData.logo.fileId}`}
                          alt="Logo"
                          className="object-contain w-full h-full transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl"></div>
                <div className="relative">
                  <div className="p-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                    <div className="flex items-center justify-center w-48 h-48 bg-gray-900 rounded-full">
                      <span className="text-6xl font-bold text-amber-500">
                        {themeData.user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shop Name */}
            <motion.h1
              variants={itemAnimation}
              className="mb-2 text-2xl font-bold text-center text-white md:text-5xl md:mb-4"
            >
              {themeData.user.businessName}
            </motion.h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl px-4 mx-auto -mt-4 space-y-6 md:-mt-8 md:space-y-8">
        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border bg-zinc-900/50 backdrop-blur-sm rounded-2xl border-zinc-800"
        >
          {/* Section Title */}
          <div className="p-4 border-b md:p-6 border-zinc-800">
            <h2 className="text-xl font-semibold text-center text-white md:text-2xl">
              Preisliste
            </h2>
          </div>

          {/* Services List */}
          <div className="p-4 space-y-3 md:p-6">
            {themeData.services.map((service) => (
              <div
                key={service._id}
                className="flex items-center justify-between p-3 transition-colors rounded-xl bg-white/5 hover:bg-white/10"
              >
                <span className="text-base text-gray-100 md:text-lg">
                  {service.name}
                </span>
                <span className="font-medium md:text-xl text-amber-400">
                  {service.price}€
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Business Hours & Address Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Hours - Only show if there are business hours */}
          {Object.values(themeData.socialMedia.businessHours).some(
            (hours) => hours.open && hours.close
          ) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border bg-zinc-900/50 backdrop-blur-sm rounded-2xl border-zinc-800"
            >
              <div className="p-4 border-b md:p-6 border-zinc-800">
                <h2 className="text-xl font-semibold text-white md:text-2xl">
                  Öffnungszeiten
                </h2>
              </div>
              <div className="p-4 space-y-3 md:p-6">
                {Object.entries(themeData.socialMedia.businessHours).map(
                  ([day, hours]) => {
                    if (!hours.open && !hours.close) return null;
                    return (
                      <div
                        key={day}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-300 md:text-base">
                          {day === "monday" && "Montag"}
                          {day === "tuesday" && "Dienstag"}
                          {day === "wednesday" && "Mittwoch"}
                          {day === "thursday" && "Donnerstag"}
                          {day === "friday" && "Freitag"}
                          {day === "saturday" && "Samstag"}
                          {day === "sunday" && "Sonntag"}
                        </span>
                        <span className="font-medium md:text-base text-amber-400">
                          {hours.open && hours.close
                            ? `${hours.open} - ${hours.close}`
                            : "Geschlossen"}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          )}

          {/* Address Section */}
          {themeData.socialMedia.address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border bg-zinc-900/50 backdrop-blur-sm rounded-2xl border-zinc-800"
            >
              <div className="p-4 border-b md:p-6 border-zinc-800">
                <h2 className="text-xl font-semibold text-white md:text-2xl">
                  Adresse
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <p className="text-base text-gray-300 whitespace-pre-line">
                  {themeData.socialMedia.address}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Contact Section - Only show if there are contact details */}
        {(themeData.socialMedia.phone ||
          themeData.socialMedia.whatsapp ||
          themeData.socialMedia.instagram ||
          themeData.socialMedia.googleMaps) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border bg-zinc-900/50 backdrop-blur-sm rounded-2xl border-zinc-800"
          >
            <div className="p-4 border-b md:p-6 border-zinc-800">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Kontakt
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-center gap-8">
                {themeData.socialMedia.phone && (
                  <a
                    href={`tel:${themeData.socialMedia.phone}`}
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <FaPhone className="w-5 h-5 text-amber-400" />
                  </a>
                )}
                {themeData.socialMedia.whatsapp && (
                  <a
                    href={`https://wa.me/+49${themeData.socialMedia.whatsapp.replace(
                      /[\s+]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <FaWhatsapp className="w-5 h-5 text-amber-400" />
                  </a>
                )}
                {themeData.socialMedia.instagram && (
                  <a
                    href={themeData.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <FaInstagram className="w-5 h-5 text-amber-400" />
                  </a>
                )}
                {themeData.socialMedia.googleMaps && (
                  <a
                    href={themeData.socialMedia.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <FaMapMarkerAlt className="w-5 h-5 text-amber-400" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Space */}
      <div className="h-12"></div>
    </div>
  );
};

export default Theme;
