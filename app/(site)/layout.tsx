import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  )
}
