import {IntroAnimation} from '@/app/components/IntroAnimation'
import {InvisiblesContent} from '@/app/components/InvisiblesContent'

// Homepage = immersive 3D intro (500 vh scroll journey) → editorial Invisibles sections
export default function Page() {
  return (
    <>
      <IntroAnimation />
      <InvisiblesContent />
    </>
  )
}
