import { HeroSection } from '@/components/storefront/home/HeroSection'
import { CategoryGrid } from '@/components/storefront/home/CategoryGrid'
import { NewArrivalsStrip } from '@/components/storefront/home/NewArrivalsStrip'
import { BrandStorySection } from '@/components/storefront/home/BrandStorySection'
import { NewsletterSection } from '@/components/storefront/home/NewsletterSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <NewArrivalsStrip />
      <BrandStorySection />
      <NewsletterSection />
    </>
  )
}
