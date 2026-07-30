import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import VisitorTracker from '@/components/VisitorTracker';
import { getExperiences, getFunFacts, getPortfolioData, getProjects, getSkills } from '@/lib/services';

export default async function Home() {
  const [portfolio, projects, experiences, skills, funFacts] = await Promise.all([
    getPortfolioData(),
    getProjects(),
    getExperiences(),
    getSkills(),
    getFunFacts(),
  ]);

  return (
    <main className="min-h-screen flex flex-col">
      <VisitorTracker />
      <Header />
      <Hero data={portfolio} />
      <About funFacts={funFacts} />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Skills skills={skills} />
      <Contact />
      <Footer />
    </main>
  );
}
