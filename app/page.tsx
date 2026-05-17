import {IntroAnimation} from '@/app/components/IntroAnimation'

// The homepage is the immersive intro experience.
// Navigation to /blog and /about appears after the animation settles.
// Header and Footer are intentionally absent on this route —
// they live in app/(site)/layout.tsx for all other pages.
export default function Page() {
  return <IntroAnimation />
}
