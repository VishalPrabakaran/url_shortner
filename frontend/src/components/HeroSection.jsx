export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#EAEAEA] py-16 sm:py-20">
      
      {/* Premium accent colorful mesh gradient panel background element */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500/10 via-cyan-400/10 to-blue-500/10 opacity-70 blur-3xl" />
      
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[11px] font-semibold text-[#0057FF] mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF] animate-pulse"></span>
          <span>Active</span>
        </div>

        {/* Large Typography Block */}
        <h1 className="text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl lg:text-6xl leading-[1.1]">
          Optimize & Shorten Your <br />
          <span className="bg-gradient-to-r from-[#0057FF] via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Custom Links Layout
          </span>
        </h1>
        
        {/* Muted Sub-header */}
        <p className="mx-auto mt-6 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-[#666666]">
          Experience enterprise-grade URL reduction. Generate secure custom aliases, set dynamic expiration parameters, and capture deep visitor insights within Wix Studio's standard grid layouts.
        </p>

      </div>
    </section>
  );
}
