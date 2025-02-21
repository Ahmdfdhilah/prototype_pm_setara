import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BecomeMitraSection from "@/components/Mitra";
import Navbar from "@/components/NavbarHome";
import Target from "@/components/Target";
import React from "react";
import CoffeeChallengesSection from "@/components/Challenge";
import ActionStepsSection from "@/components/Action";

const LandingPage: React.FC = () => {
    return (
        <div className="overflow-hidden">
            <Navbar />
            <Hero />
            <Target />
            <CoffeeChallengesSection/>
            <ActionStepsSection/>
            <BecomeMitraSection/>
            <Footer />
        </div>
    );
};

export default LandingPage;