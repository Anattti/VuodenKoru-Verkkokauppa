import StoryHero from "@/components/Story/StoryHero";
import StoryContent from "@/components/Story/StoryContent";
import StoryArticle from "@/components/Story/StoryArticle";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar";

export default function StoryPage() {
    return (
        <main className="bg-black min-h-screen">
            <Navbar />
            <StoryHero />
            <StoryContent />
            <StoryArticle />
            <Footer />
        </main>
    );
}
