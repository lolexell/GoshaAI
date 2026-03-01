const GOJO_IMAGE = 'https://i.pinimg.com/736x/b2/3b/09/b23b09b33e63a7b96cab8862b72f8bfe.jpg';

export function GojoAvatar({ size = 160 }: { size?: number }) {
  return (
    <div className="relative group" style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-60 blur-md animate-pulse-glow" />
      <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-40 animate-spin-slow" style={{ animationDuration: '8s' }} />
      
      {/* Border ring */}
      <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-[3px]">
        <div className="w-full h-full rounded-full bg-[#0f172a]" />
      </div>
      
      {/* Image */}
      <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/20">
        <img
          src={GOJO_IMAGE}
          alt="Gojo Satoru"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 via-transparent to-cyan-500/10 pointer-events-none" />
      </div>

      {/* Sparkle effects */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/4 -right-2 w-1.5 h-1.5 bg-purple-400 rounded-full blur-[2px] animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

export function GojoSmallAvatar({ size = 36 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow */}
      <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-50 blur-[3px]" />
      
      {/* Border */}
      <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 p-[2px]">
        <div className="w-full h-full rounded-full bg-[#0f172a]" />
      </div>
      
      {/* Image */}
      <div className="absolute inset-0 rounded-full overflow-hidden border border-cyan-500/20">
        <img
          src={GOJO_IMAGE}
          alt="Gojo Satoru"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
      </div>
    </div>
  );
}
