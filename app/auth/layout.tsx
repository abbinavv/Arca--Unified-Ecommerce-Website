export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-arca-ivory flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="text-center mb-12">
          <span className="font-display text-3xl font-light tracking-[0.25em] text-arca-ink uppercase">
            Arca
          </span>
          <div className="mt-1 h-px w-8 bg-arca-gold mx-auto" />
        </div>
        {children}
      </div>
    </div>
  )
}
