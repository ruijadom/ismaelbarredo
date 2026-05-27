import type {Metadata} from 'next'
import {InvisiblesContent} from '@/app/components/InvisiblesContent'

export const metadata: Metadata = {
  title: 'invisibles — ismael barredo',
  description: 'Invisibles · proyecto artístico hispano-portugués',
}

export default function InvisiblesPage() {
  return <InvisiblesContent />
}
