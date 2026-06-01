/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, ArrowUpDown, CornerDownRight, ExternalLink } from 'lucide-react';
import { BookmarkMetadata, Card } from '../types';

type BookmarkSortMethod = 'category' | 'date-added-asc' | 'date-added-desc' | 'last-seen';

const SORT_OPTIONS: { value: BookmarkSortMethod; label: string }[] = [
  { value: 'category', label: 'Category' },
  { value: 'date-added-desc', label: 'Date added: newest' },
  { value: 'date-added-asc', label: 'Date added: oldest' },
  { value: 'last-seen', label: 'Last seen' },
];

interface BookmarkViewProps {
  bookmarkedCards: Card[];
  bookmarkMetadata: Record<string, BookmarkMetadata>;
  onRemoveBookmark: (cardId: string) => void;
  onViewInFeed: (cardId: string) => void;
}

export default function BookmarkView({
  bookmarkedCards,
  bookmarkMetadata,
  onRemoveBookmark,
  onViewInFeed,
}: BookmarkViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<BookmarkSortMethod>(() => {
    const savedSortMethod = localStorage.getItem('learnscroll_bookmark_sort_method');
    return SORT_OPTIONS.some((option) => option.value === savedSortMethod)
      ? (savedSortMethod as BookmarkSortMethod)
      : 'date-added-desc';
  });

  useEffect(() => {
    localStorage.setItem('learnscroll_bookmark_sort_method', sortMethod);
  }, [sortMethod]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const sortedBookmarkedCards = useMemo(() => {
    return [...bookmarkedCards].sort((a, b) => {
      const aMetadata = bookmarkMetadata[a.id];
      const bMetadata = bookmarkMetadata[b.id];
      const aAddedAt = aMetadata?.addedAt || 0;
      const bAddedAt = bMetadata?.addedAt || 0;
      const aLastSeenAt = aMetadata?.lastSeenAt || 0;
      const bLastSeenAt = bMetadata?.lastSeenAt || 0;

      switch (sortMethod) {
        case 'category': {
          const categoryCompare = a.category.localeCompare(b.category);
          if (categoryCompare !== 0) return categoryCompare;
          return a.title.localeCompare(b.title);
        }
        case 'date-added-asc':
          return aAddedAt - bAddedAt;
        case 'last-seen':
          return bLastSeenAt - aLastSeenAt || bAddedAt - aAddedAt;
        case 'date-added-desc':
        default:
          return bAddedAt - aAddedAt;
      }
    });
  }, [bookmarkMetadata, bookmarkedCards, sortMethod]);

  return (
    <div className="min-h-screen w-full bg-[#F4F1EA] text-[#1A1A1A] px-5 pb-24 pt-6 md:px-8">
      <div className="mx-auto w-full max-w-[480px] space-y-6">
        
        {/* Header */}
        <div className="pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/10">
              <Bookmark className="h-4.5 w-4.5" />
            </div>
            <h1 className="font-display font-light text-2xl tracking-tight text-[#1A1A1A]">
              Syllabus Collection
            </h1>
          </div>
          <p className="font-sans text-[11px] text-[#1A1A1A]/60 mt-1">
            Your star-marked study cards, summaries, and facts preserved for reviews.
          </p>
        </div>

        {/* Empty state */}
        {bookmarkedCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1A1A1A]/20 bg-white/40 px-5 py-12 text-center">
            <span className="block text-4xl mb-3">⭐</span>
            <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">
              Your collection is empty
            </h3>
            <p className="font-sans text-xs text-[#1A1A1A]/60 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
              When swiping cards in the Explore tab, hit the Star/Bookmark button to save key learnings here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2 pb-1">
              <div className="flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[#1A1A1A]/50">
                  {bookmarkedCards.length} saved item{bookmarkedCards.length !== 1 ? 's' : ''}
                </span>
                <span className="font-sans text-[10px] text-[#1A1A1A]/50 flex items-center gap-1 font-semibold uppercase tracking-wider">
                  <ArrowUpDown className="h-3 w-3" /> Tap to read details
                </span>
              </div>

              <label className="flex items-center justify-between rounded-lg border border-[#1A1A1A]/10 bg-white px-3 py-2 shadow-sm">
                <span className="font-sans text-[9px] font-black uppercase tracking-wider text-[#1A1A1A]/50">
                  Sort by
                </span>
                <select
                  id="bookmark-sort-method"
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value as BookmarkSortMethod)}
                  title="Sort syllabus collection"
                  aria-label="Sort syllabus collection"
                  className="max-w-[190px] rounded-md border border-[#1A1A1A]/10 bg-[#F4F1EA]/80 px-2 py-1 font-sans text-[10px] font-bold text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]/30"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-3">
              {sortedBookmarkedCards.map((card) => {
                const isExpanded = expandedId === card.id;

                return (
                  <motion.div
                    key={card.id}
                    layout="position"
                    className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                      isExpanded
                        ? 'border-[#1A1A1A] bg-white'
                        : 'border-[#1A1A1A]/10 bg-white hover:border-[#1A1A1A]/25'
                    }`}
                  >
                    {/* Collapsed view header */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpand(card.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          toggleExpand(card.id);
                        }
                      }}
                      className="flex items-center justify-between p-4 cursor-pointer outline-none select-none text-left"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: card.backgroundColor }}
                        />
                        <div className="truncate">
                          <span className="inline-block rounded-full px-2 py-0.5 font-sans text-[9px] font-black tracking-[0.1em] uppercase text-white bg-[#1A1A1A] pointer-events-none">
                            {card.category}
                          </span>
                          <h3 className="font-sans text-sm font-bold text-[#1A1A1A] mt-1.5 truncate pointer-events-none">
                            {card.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          id={`bookmark-view-open-feed-${card.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewInFeed(card.id);
                          }}
                          className="rounded-md p-1.5 text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] transition-colors"
                          title="View fullscreen"
                          aria-label={`View ${card.title} fullscreen`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                        <button
                          id={`bookmark-view-unbookmark-${card.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(card.id);
                          }}
                          className="rounded-md p-1.5 text-red-650 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Remove bookmark"
                          aria-label={`Remove ${card.title} from bookmarks`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable details body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="border-t border-[#1A1A1A]/10 p-4 bg-[#F4F1EA]/30 space-y-4">
                            {/* Staggered explanation text */}
                            <div className="space-y-3.5 text-left pointer-events-none">
                              {card.paragraphs.map((para, pIdx) => (
                                <p
                                  key={pIdx}
                                  className="font-serif text-[13px] leading-relaxed text-[#1A1A1A]/85"
                                >
                                  {para}
                                </p>
                              ))}
                            </div>

                            {/* Bullet-takeaway details */}
                            <div className="border-l-2 border-[#1A1A1A] bg-[#F4F1EA]/70 p-3.5 flex gap-2 pt-2.5 text-left rounded-r-lg pointer-events-none">
                              <CornerDownRight className="h-3.5 w-3.5 text-[#1A1A1A]/50 shrink-0 mt-0.5" />
                              <div>
                                <span className="block font-sans text-[9px] font-black tracking-wider text-[#1A1A1A]/50 uppercase">
                                  Takeaway Summary
                                </span>
                                <span className="block font-serif text-[12px] text-[#1A1A1A]/90 mt-1 italic leading-relaxed">
                                  {card.takeaway}
                                </span>
                              </div>
                            </div>

                            {/* Hashtags & Channel label */}
                            <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 pt-3 pointer-events-none">
                              <span className="font-mono text-[9px] text-[#1A1A1A]/50">
                                @{card.channelName}
                              </span>
                              <div className="flex space-x-1.5">
                                {card.hashtags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="font-mono text-[9px] text-[#1A1A1A]/60 font-semibold"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
