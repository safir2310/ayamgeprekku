'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, fontSize: 'text-lg' },
    md: { width: 48, height: 48, fontSize: 'text-xl' },
    lg: { width: 64, height: 64, fontSize: 'text-2xl' },
  };

  const { width, height, fontSize } = sizes[size];

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Chef Hat Logo */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.svg
          width={width}
          height={height}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            filter: [
              'drop-shadow(0 0 2px rgba(255, 106, 0, 0.3))',
              'drop-shadow(0 0 8px rgba(255, 106, 0, 0.6))',
              'drop-shadow(0 0 2px rgba(255, 106, 0, 0.3))',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Hat Base */}
          <path
            d="M8 48 L56 48 L56 56 C56 60.4 52.4 64 48 64 L16 64 C11.6 64 8 60.4 8 56 L8 48Z"
            fill="url(#hatGradient)"
          />
          {/* Hat Top - Fluffy part */}
          <path
            d="M8 48 C8 32 12 20 20 12 C24 8 32 6 32 6 C32 6 40 8 44 12 C52 20 56 32 56 48 L8 48Z"
            fill="url(#hatGradient)"
          />
          {/* Chef Hat Band */}
          <path
            d="M4 40 L60 40 L60 48 L4 48 L4 40Z"
            fill="#cc5500"
          />
          {/* Highlights */}
          <ellipse
            cx="20"
            cy="28"
            rx="8"
            ry="10"
            fill="rgba(255,255,255,0.2)"
          />
          <ellipse
            cx="44"
            cy="28"
            rx="8"
            ry="10"
            fill="rgba(255,255,255,0.2)"
          />
          <defs>
            <linearGradient
              id="hatGradient"
              x1="8"
              y1="6"
              x2="56"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffd000" />
              <stop offset="50%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff6a00" />
            </linearGradient>
          </defs>
        </motion.svg>
        {/* Fire particles */}
        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 0C6 0 8 3 8 6C8 8 7 9 6 9C5 9 4 8 4 6C4 3 6 0 6 0Z"
              fill="#ff4500"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Brand Name */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span
            className={`font-bold text-gradient-brand ${fontSize} leading-tight`}
          >
            AYAM GEPREK
          </span>
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            SAMBAL IJO 🔥
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
