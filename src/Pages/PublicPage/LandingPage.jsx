import React from "react";
import Navbar from "../../Components/Public/Navbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/Hero.jpg";
import FadeInSection from "../../Components/Public/FadeInSection"; 
import About from "../../Components/Public/About";
import Posts from "../../Components/Public/Posts";
import ContactSection from "../../Components/Public/Contact";
import Footer from "../../Components/Public/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar />

      <section
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        id="home"
      >
        <div className="text-center text-white px-6 bg-transparent rounded-xl p-6">
          <FadeInSection>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Share Your Stories with the World
            </h1>
          </FadeInSection>

          <FadeInSection>
            <p className="text-lg sm:text-xl mb-8">
              Write, publish, and connect with readers on{" "}
              <span className="font-bold">Scribe</span>.
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login?mode=register"
                className="px-6 py-3 rounded-lg bg-white text-blue-700 font-medium shadow hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <button
                onClick={() => scrollToSection("posts")}
                className="px-6 py-3 cursor-pointer rounded-lg border border-white font-medium hover:bg-blue-600 hover:text-white hover:border-0 transition"
              >
                Explore Posts
              </button>
            </div>
          </FadeInSection>
        </div>
      </section>

      <FadeInSection>
        <About />   
      </FadeInSection>

      <FadeInSection>
        <Posts />
      </FadeInSection>

      <FadeInSection>
        <ContactSection />
      </FadeInSection>

      <FadeInSection>
        <Footer />
      </FadeInSection>
    </>
  );
};

export default LandingPage;