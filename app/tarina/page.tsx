import StoryHero from "@/components/Story/StoryHero";
import StoryContent from "@/components/Story/StoryContent";
import StoryArticle from "@/components/Story/StoryArticle";
import Footer from "@/components/Footer";

export default function StoryPage() {
    return (
        <main className="bg-black min-h-screen">
            <StoryHero />
            <StoryContent />
            <StoryArticle />
            <Footer />
        </main>
    );
}
