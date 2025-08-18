"use client";

import React from 'react';
import classNames from 'classnames';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '@/styles/animations.css';

interface AnimatedCardWrapperProps {
  children: React.ReactNode;
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInFromBottom';
  delay?: number;
  className?: string;
}

export default function AnimatedCardWrapper({
  children,
  animationType = 'fadeInUp',
  delay = 0,
  className = ''
}: AnimatedCardWrapperProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
    delay
  });

  const animationClasses = classNames(
    animationType,
    {
      [`${animationType}Visible`]: isVisible,
    },
    'animatedCard',
    className
  );

  return (
    <div ref={elementRef} className={animationClasses}>
      {children}
    </div>
  );
}
