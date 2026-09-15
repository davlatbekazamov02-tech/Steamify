"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X, Search, Check } from "lucide-react";
import { UZBEKISTAN_REGIONS, getRegionName } from "@/lib/regions";
import { cn } from "@/lib/utils";

interface RegionFilterProps {
  selectedRegion?: string;
  onSelectRegion: (regionId: string) => void;
  locale?: string;
}

export function RegionFilter({
  selectedRegion = "all",
  onSelectRegion,
  locale = "uz",
}: RegionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0, width: 0 });
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return UZBEKISTAN_REGIONS;
    const q = searchQuery.toLowerCase();
    return UZBEKISTAN_REGIONS.filter(
      (r) =>
        r.nameUz.toLowerCase().includes(q) ||
        r.nameEn.toLowerCase().includes(q) ||
        r.nameRu.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Calculate dropdown position relative to button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const rect = buttonRef.current!.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // On desktop, position below button aligned to right
        if (viewportWidth >= 768) {
          setDropdownPosition({
            top: rect.bottom + 8, // 8px gap (mt-2)
            right: viewportWidth - rect.right,
            width: 320, // w-80 = 320px
          });
        }
      };
      
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    // Delay to avoid immediate close on button click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (id: string) => {
    onSelectRegion(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery("");
    }
  };

  const isAll = !selectedRegion || selectedRegion === "all";

  // Dropdown content component
  const DropdownContent = () => (
    <>
      {/* Backdrop - only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
          style={{ zIndex: 9998 }}
          onClick={() => {
            setIsOpen(false);
            setSearchQuery("");
          }}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "bg-[#0c1426] border border-cyan-900/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden",
            // Mobile: fixed bottom sheet
            "fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[80vh]",
            // Desktop: absolutely positioned via inline styles
            "md:rounded-2xl md:max-h-[500px] md:inset-auto md:bottom-auto"
          )}
          style={{
            zIndex: 9999,
            // Desktop positioning via inline styles
            ...(typeof window !== "undefined" && window.innerWidth >= 768
              ? {
                  position: "fixed",
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`,
                  width: `${dropdownPosition.width}px`,
                }
              : {}),
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="region-filter-title"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <h3
                id="region-filter-title"
                className="text-xs font-bold uppercase tracking-wider text-white"
              >
                HUDUDNI TANLANG
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                O'zbekiston yoki o'z viloyatingiz reytingi
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hududni qidirish..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                autoFocus={typeof window !== "undefined" && window.innerWidth >= 768}
                aria-label="Hudud qidirish"
              />
            </div>
          </div>

          {/* Region List */}
          <div className="p-2 max-h-[320px] overflow-y-auto space-y-1 scrollbar-hide">
            {/* O'zbekiston (Default / All) */}
            <button
              onClick={() => handleSelect("all")}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left",
                isAll
                  ? "bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  : "text-slate-300 hover:bg-slate-900/70"
              )}
              aria-pressed={isAll}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm" aria-hidden="true">🇺🇿</span>
                <span>O'zbekiston (Barchasi)</span>
              </div>
              {isAll && <Check className="w-4 h-4 text-cyan-400" aria-hidden="true" />}
            </button>

            <div className="h-px bg-slate-800/60 my-1" role="separator" />

            {/* 14 Regions */}
            {filteredRegions.map((region) => {
              const selected = selectedRegion === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelect(region.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left",
                    selected
                      ? "bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "text-slate-300 hover:bg-slate-900/70"
                  )}
                  aria-pressed={selected}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" aria-hidden="true" />
                    <span>{getRegionName(region.id, locale)}</span>
                  </div>
                  {selected && <Check className="w-4 h-4 text-cyan-400" aria-hidden="true" />}
                </button>
              );
            })}

            {filteredRegions.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500" role="status">
                Hudud topilmadi
              </div>
            )}
          </div>

          {/* Footer with Reset option */}
          {!isAll && (
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex justify-end">
              <button
                onClick={() => handleSelect("all")}
                className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Filtrni tozalash (O'zbekiston)
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="relative">
      {/* Filter Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 shadow-sm",
          !isAll
            ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-slate-700"
        )}
        aria-label="Hududni filtrlash"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
        <span className="hidden sm:inline">Filtr</span>
        {!isAll && (
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
        )}
      </button>

      {/* Render dropdown via Portal for proper stacking */}
      {mounted && typeof window !== "undefined" && createPortal(
        <DropdownContent />,
        document.body
      )}
    </div>
  );
}
