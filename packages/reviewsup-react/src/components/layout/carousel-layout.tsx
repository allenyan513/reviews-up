'use client';

import React, { useState, useEffect, ReactNode } from 'react';

export interface CarouselLayoutProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
}

export function CarouselLayout<T>({
  items,
  renderItem,
  autoSlide = false,
  slideInterval = 3000,
  className = '',
}: CarouselLayoutProps) {
  // Number of "buffer" slides to add at the beginning and end for smooth infinite loop
  // You might need to adjust this based on your specific visual needs.
  const bufferSlides = 1;

  // Create an augmented list of items for the infinite scroll effect
  const augmentedItems = [
    ...items.slice(-bufferSlides), // Prepend last few items
    ...items, // Original items
    ...items.slice(0, bufferSlides), // Append first few items
  ];

  // Initialize currentIndex to start at the first *real* item
  const [currentIndex, setCurrentIndex] = useState(bufferSlides);
  const [isTransitioning, setIsTransitioning] = useState(true); // Control CSS transition

  const prevSlide = () => {
    setIsTransitioning(true); // Enable transition for regular movement
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const nextSlide = () => {
    setIsTransitioning(true); // Enable transition for regular movement
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // Effect to handle the "jump" for infinite loop
  useEffect(() => {
    if (currentIndex === augmentedItems.length - bufferSlides) {
      // If we're on the first duplicated real slide
      const timer = setTimeout(() => {
        setIsTransitioning(false); // Disable transition
        setCurrentIndex(bufferSlides); // Jump to the real first slide
      }, 500); // Wait for the transition to finish (should match CSS transition duration)
      return () => clearTimeout(timer);
    } else if (currentIndex === bufferSlides - 1) {
      // If we're on the last duplicated real slide
      const timer = setTimeout(() => {
        setIsTransitioning(false); // Disable transition
        setCurrentIndex(augmentedItems.length - bufferSlides * 2); // Jump to the real last slide
      }, 500); // Wait for the transition to finish
      return () => clearTimeout(timer);
    }
    // Re-enable transition if we move away from the jump points
    if (
      !isTransitioning &&
      currentIndex >= bufferSlides &&
      currentIndex < augmentedItems.length - bufferSlides
    ) {
      setIsTransitioning(true);
    }
  }, [currentIndex, augmentedItems.length, bufferSlides, isTransitioning]);

  // Auto-slide effect (similar to your original, but using augmentedItems and handling transition)
  useEffect(() => {
    if (!autoSlide || items.length === 0) return;

    const slideTimer = setInterval(() => {
      setIsTransitioning(true); // Ensure transition is enabled for auto-slide
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, slideInterval);

    return () => clearInterval(slideTimer);
  }, [autoSlide, slideInterval, currentIndex, items.length]);

  // Calculate the transform value
  const transformValue = `translateX(-${currentIndex * 100}%)`;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: transformValue }}
      >
        {augmentedItems.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            } hover:bg-white focus:outline-none`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
