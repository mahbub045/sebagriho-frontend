const AuthPageSidePanel: React.FC = () => {
  return (
    <div className='relative hidden overflow-hidden p-7 text-white lg:flex lg:flex-col lg:justify-between'>
      {/* Background Image */}
      <div className='absolute inset-0 bg-[url("/images/banner.png")] bg-cover bg-center bg-no-repeat' />

      {/* Soft secondary tint */}
      <div className='bg-secondary/70 absolute inset-0' />

      {/* Soft color gradient */}
      <div className='from-primary to-secondary/50 absolute inset-0 bg-linear-to-br via-transparent' />

      {/* Content */}
      <div className='relative z-10 flex flex-1 items-center'>
        {/* Heading */}
        <div className='space-y-3'>
          <p className='text-[11px] font-semibold tracking-[0.3em] text-white/90 uppercase'>
            Welcome back
          </p>

          <h1 className='max-w-md text-3xl leading-[1.15] font-bold tracking-tight text-white drop-shadow-sm'>
            Manage your operations from one place.
          </h1>
        </div>
      </div>

      {/* Bottom Information */}
      <div className='bg-secondary/20 relative z-10 rounded-2xl border border-white/25 px-4 py-3 backdrop-blur-sm'>
        <p className='text-xs leading-relaxed text-white'>
          Every customer interaction, every order, and every update in one
          centralized workspace.
        </p>
      </div>
    </div>
  );
};

export default AuthPageSidePanel;
