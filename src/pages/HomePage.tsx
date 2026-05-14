import { HomeIntro } from '../components/home/HomeIntro';
import { FeaturedFCs } from '../components/home/FeaturedFCs';
import { HowItWorks } from '../components/home/HowItWorks';

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <div className="ca-container">
        <FeaturedFCs />
        <HowItWorks />
      </div>
    </>
  );
}
