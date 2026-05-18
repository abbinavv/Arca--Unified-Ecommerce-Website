'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const hasMultiple = images.length > 1

  const prev = useCallback(() => {
    setActiveIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const openLightbox = () => {
    if (images.length > 0) setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prev, next])

  const activeImage = images[activeIndex] ?? null

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative aspect-[3/4] bg-arca-cream overflow-hidden group">
          {activeImage ? (
            <img
              src={activeImage}
              alt={productName}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={openLightbox}
            />
          ) : (
            <div className="absolute inset-0 bg-arca-bone flex items-center justify-center">
              <span className="font-display text-3xl font-light tracking-[0.3em] uppercase text-arca-stone/30">
                Arca
              </span>
            </div>
          )}

          {/* Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {hasMultiple && (
            <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[11px] font-mono px-2 py-0.5 pointer-events-none">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border transition-colors duration-150 ${
                  i === activeIndex ? 'border-arca-ink' : 'border-arca-sand hover:border-arca-stone'
                }`}
              >
                <img
                  src={url}
                  alt={`${productName} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-5 right-6 text-white text-3xl leading-none hover:text-white/60 transition-colors z-10"
          >
            ×
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-16 flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {activeImage && (
              <img
                src={activeImage}
                alt={productName}
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>

          {/* Arrow left */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Arrow right */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
