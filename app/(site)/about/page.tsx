import type {Metadata} from 'next'
import {AboutContent} from '@/app/components/AboutContent'
import {SeaAudio} from '@/app/components/SeaAudio'

export const metadata: Metadata = {
  title: 'sobre — invisibles',
}

export default function AboutPage() {
  return (
    <>
      <AboutContent />
      <SeaAudio />
    </>
  )
}
