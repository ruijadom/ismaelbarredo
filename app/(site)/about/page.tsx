import type {Metadata} from 'next'
import {AboutContent} from '@/app/components/AboutContent'

export const metadata: Metadata = {
  title: 'bio — ismael barredo',
  description: 'Músico · Compositor · Artista Visual · Musicoterapeuta · Educador Social',
}

export default function AboutPage() {
  return <AboutContent />
}
