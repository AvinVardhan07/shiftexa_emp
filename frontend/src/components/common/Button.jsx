import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Universal JellyButton Component
 * Features dual-spring jelly physics, pill capsule geometry, and Google Blue primary branding.
 *
 * Variants:
 *  - 'primary': Brand Google Blue (#1A73E8) with white text & soft glow
 *  - 'secondary': Subtle Google Blue Soft (#E8F0FE) with blue text (#1A73E8)
 *  - 'outline': White surface with subtle gray border (#747775 / #E3E3E3)
 *  - 'ghost': Transparent surface with hover feedback (#F0F4F9)
 *  - 'danger': Vibrant red (#D93025) with white text
 *
 * Sizes:
 *  - 'sm': h-8 px-3.5 text-xs (chips, small actions)
 *  - 'md': h-10 px-5 text-xs/sm (standard action buttons)
 *  - 'lg': h-12 px-7 text-sm (hero CTAs, main checkout/submit)
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon = null,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    ...rest
  },
  ref
) {
  const variantStyles = {
    primary:
      'bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#104D9C] text-white border-transparent shadow-[0_2px_8px_rgba(26,115,232,0.28)] hover:shadow-[0_4px_16px_rgba(26,115,232,0.42)]',
    secondary:
      'bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] border-[#D2E3FC] hover:border-[#1A73E8]',
    outline:
      'bg-white hover:bg-[#E8F0FE] text-[#1F1F1F] hover:text-[#1A73E8] border-[#747775] hover:border-[#1A73E8] shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
    ghost:
      'bg-transparent hover:bg-[#F0F4F9] text-[#444746] hover:text-[#1F1F1F] border-transparent',
    danger:
      'bg-[#D93025] hover:bg-[#B31412] active:bg-[#A50E0E] text-white border-transparent shadow-[0_2px_8px_rgba(217,48,37,0.25)]',
  };

  const sizeStyles = {
    sm: 'h-8 px-3.5 text-xs gap-1.5',
    md: 'h-10 px-5 text-xs font-semibold gap-2',
    lg: 'h-12 px-7 text-sm font-semibold gap-2.5',
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <motion.button
      ref={ref}
      data-motion="true"
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? undefined : { scale: 1.025, y: -0.5 }}
      whileTap={
        disabled || loading
          ? undefined
          : {
              scale: 0.955,
              y: 0.5,
              transition: { type: 'spring', stiffness: 650, damping: 18 }
            }
      }
      transition={{
        type: 'spring',
        stiffness: 580,
        damping: 24,
        mass: 0.8
      }}
      className={`relative inline-flex items-center justify-center rounded-full font-semibold border select-none transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${currentVariant} ${currentSize} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
});

export default Button;
