import React, { useState } from 'react';

const onboardingData = [
  {
    id: 1,
    title: 'Discover Premium Fashion',
    description: 'Explore our curated collection of high-end clothing designed for the modern individual.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Uncompromising Quality',
    description: 'Every piece is crafted with precision, ensuring you look and feel your absolute best.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Seamless Experience',
    description: 'Fast shipping, easy returns, and a premium shopping experience from start to finish.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

// Role selector shown as the final "step" after all onboarding slides
const RoleSelector = ({ onSelectRole }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f1410] px-6">
    {/* Background accent */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl" />
    </div>

    <div className="relative z-10 w-full max-w-sm text-center">
      {/* Brand */}
      <div className="mb-10">
        <span className="font-display text-4xl font-semibold tracking-widest text-white block">
          RIZLA
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary-400 block mt-1">
          Boutique
        </span>
      </div>

      <h2 className="text-2xl font-black text-white tracking-tight mb-2">
        How are you joining?
      </h2>
      <p className="text-sm text-gray-400 mb-10 leading-relaxed">
        Select your role to access the right experience.
      </p>

      <div className="space-y-4">
        {/* Customer button */}
        <button
          onClick={() => onSelectRole('customer')}
          className="group w-full relative overflow-hidden rounded-2xl border border-primary-800/40 bg-primary-900/20 px-6 py-5 text-left transition-all duration-300 hover:bg-primary-900/40 hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-900/20 active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-900/50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-800/60 transition-colors">
              <svg className="w-6 h-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-base">I'm a Customer</p>
              <p className="text-xs text-gray-400 mt-0.5">Shop, browse & manage orders</p>
            </div>
            <svg className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>

        {/* Admin button */}
        <button
          onClick={() => onSelectRole('admin')}
          className="group w-full relative overflow-hidden rounded-2xl border border-gray-700/40 bg-gray-800/20 px-6 py-5 text-left transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-600/60 hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gray-700/60 transition-colors">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-base">I'm an Admin</p>
              <p className="text-xs text-gray-400 mt-0.5">Manage store, products & orders</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>
      </div>

      <p className="mt-8 text-[11px] text-gray-600">
        Admin access: <span className="text-gray-500 font-mono">sattaarkureshi87@gmail.com</span>
      </p>
    </div>
  </div>
);

// ── Main Onboarding component ─────────────────────────────────────────────────
const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // showRoleSelector becomes true after all slides are done
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // All slides done → show role selector
      setShowRoleSelector(true);
    }
  };

  const handleSkip = () => {
    setShowRoleSelector(true);
  };

  const handleRoleSelect = (role) => {
    // Pass role to App so it can navigate after appReady
    onComplete(role);
  };

  if (showRoleSelector) {
    return <RoleSelector onSelectRole={handleRoleSelect} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-0 right-0 z-20 p-6">
        <button
          onClick={handleSkip}
          className="text-gray-500 font-bold hover:text-gray-900 transition-colors tracking-widest text-sm uppercase"
        >
          Skip
        </button>
      </div>

      {/* Image Carousel */}
      <div className="flex-1 relative overflow-hidden bg-gray-100">
        {onboardingData.map((step, index) => (
          <div
            key={step.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentStep ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/50 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent hidden lg:block w-1/2" />
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white px-8 py-12 flex flex-col items-center text-center lg:absolute lg:top-0 lg:bottom-0 lg:left-0 lg:w-1/2 lg:justify-center lg:bg-transparent lg:z-20">

        {/* Step Indicators */}
        <div className="flex gap-2 mb-8">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Text Content */}
        <div className="max-w-md w-full relative h-40">
          {onboardingData.map((step, index) => (
            <div
              key={step.id}
              className={`absolute inset-0 transition-all duration-500 transform ${
                index === currentStep
                  ? 'opacity-100 translate-x-0'
                  : index < currentStep
                  ? 'opacity-0 -translate-x-8'
                  : 'opacity-0 translate-x-8'
              }`}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                {step.title}
              </h2>
              <p className="text-gray-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="mt-8 w-full max-w-sm bg-gray-900 text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl"
        >
          {currentStep === onboardingData.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
