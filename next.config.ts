import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // Disable strict mode to prevent double WebGL context creation in dev
  reactStrictMode: false,
  // Required for Three.js and R3F to work correctly with Next.js bundler
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
  ],
}

export default nextConfig
