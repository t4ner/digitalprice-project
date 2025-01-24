import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBox, FiUsers, FiTrendingUp } from "react-icons/fi";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-6 ">
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl"
      >
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Friseur-Preislisten-Management
          </h1>
          <p className="mb-8 text-lg text-gray-300 md:text-xl">
            Verwalten Sie Ihre Preisliste digital und erreichen Sie Ihre Kunden
            ganz einfach
          </p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 text-white transition-all bg-black rounded-lg hover:bg-indigo-700"
            >
              Jetzt Starten <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-lg rounded-xl"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-lg">
              <FiBox className="text-2xl text-indigo-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Einfache Verwaltung</h3>
            <p className="text-gray-600">
              Aktualisieren Sie Ihre Preisliste in Sekundenschnelle
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-lg rounded-xl"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-lg">
              <FiUsers className="text-2xl text-indigo-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Kundenzugang</h3>
            <p className="text-gray-600">
              Aktuelle Preise immer in der Tasche Ihrer Kunden
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-lg rounded-xl"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-lg">
              <FiTrendingUp className="text-2xl text-indigo-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Digitale Transformation
            </h3>
            <p className="text-gray-600">
              Bringen Sie Ihr Geschäft in die digitale Welt
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="p-8 mt-12 bg-white shadow-lg rounded-xl">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <h4 className="text-3xl font-bold text-indigo-600 md:text-4xl">50+</h4>
              <p className="mt-2 text-gray-600">Aktive Betriebe</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-indigo-600 md:text-4xl">10K+</h4>
              <p className="mt-2 text-gray-600">Preisansichten</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-indigo-600 md:text-4xl">100%</h4>
              <p className="mt-2 text-gray-600">Benutzerfreundlich</p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="flex flex-col items-center justify-center gap-4 mt-20">
        <div className="flex items-center justify-center gap-8">
          <a
            href="https://ttyazilim.com.tr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/ttyazilim.png"
              alt="TT Yazılım Logo"
              className="object-contain h-12 transition-opacity hover:opacity-80"
            />
          </a>
          <a
            href="https://macaree.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/macaree.png"
              alt="Macaree Logo"
              className="object-contain h-12 transition-opacity hover:opacity-80"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
