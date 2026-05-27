import type {Metadata} from 'next'
import {MusicaContent} from '@/app/components/MusicaContent'

export const metadata: Metadata = {
  title: 'música — ismael barredo',
  description: 'Handpan · Live Looping · Ambient · Ecstatic Dance',
}

export default function MusicaPage() {
  return <MusicaContent />
}
