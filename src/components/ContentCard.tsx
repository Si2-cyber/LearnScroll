/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Star,
  MessageSquare,
  Share2,
  Plus,
  Check,
  Award,
  Sparkles,
} from 'lucide-react';
import { Card } from '../types';

interface ContentCardProps {
  key?: string | number;
  card: Card;
  isLiked: boolean;
  isBookmarked: boolean;
  isSubscribed: boolean;
  isActive: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onSubscribe: () => void;
  onCommentClick: () => void;
}

export default function ContentCard({
  card,
  isLiked,
  isBookmarked,
  isSubscribed,
  isActive,
  onLike,
  onBookmark,
  onSubscribe,
  onCommentClick,
}: ContentCardProps) {
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [likeAnimate, setLikeAnimate] = useState(false);
  const [starAnimate, setStarAnimate] = useState(false);

  // Trigger bounce animation states upon external prop actions
  const triggerLikeAnimation = () => {
    setLikeAnimate(true);
    setTimeout(() => setLikeAnimate(false), 300);
    onLike();
  };

  const triggerStarAnimation = () => {
    setStarAnimate(true);
    setTimeout(() => setStarAnimate(false), 300);
    onBookmark();
  };

  const handleShare = () => {
    const shareText = `📚 ${card.title} - @${card.channelName}\nCategory: ${card.category}\n"${card.takeaway}"\nLearn more on LearnScroll!`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
      }
    } catch (e) {
      // Ignored for environments with high boundary constraints
    }
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  return (
    <div
      id={`card-${card.id}`}
      className="relative flex h-full w-full shrink-0 snap-start flex-col justify-between overflow-hidden select-none p-6 md:p-8 bg-[#FFFFFF]"
    >
      {/* Decorative top fine line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#1A1A1A]/10 pointer-events-none" />

      {/* TOP HEADER: Channel & Subscription */}
      <div className="relative z-10 flex items-center justify-between pointer-events-auto mt-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-[#1A1A1A]">
            <Award className="h-4 w-4 text-[#1A1A1A]/70" />
          </div>
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-sans text-[11px] font-black tracking-wider text-[#1A1A1A] uppercase">
                @{card.channelName}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#1A1A1A]/30 pointer-events-none" />
              <span className="rounded-full bg-[#1A1A1A] px-2.5 py-0.5 font-sans text-[9px] font-black tracking-[0.1em] uppercase text-white pointer-events-none">
                {card.category}
              </span>
            </div>
            <p className="font-sans text-[9px] text-[#1A1A1A]/50 font-semibold uppercase tracking-wider pointer-events-none">
              Academic Contributor
            </p>
          </div>
        </div>

        {/* Subscribe Tab */}
        <button
          id={`subscribe-btn-${card.id}`}
          onClick={onSubscribe}
          className={`flex items-center space-x-1 rounded-md px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
            isSubscribed
              ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/70 border border-[#1A1A1A]/10'
              : 'bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#1A1A1A]/90 active:scale-95'
          }`}
        >
          {isSubscribed ? (
            <>
              <Check className="h-2.5 w-2.5 text-emerald-600" />
              <span>Subscribed</span>
            </>
          ) : (
            <>
              <Plus className="h-2.5 w-2.5" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </div>

      {/* MID SECTION: Title + Narrative Sprints */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-4 text-left max-w-[390px] mx-auto w-full">
        {/* Title display */}
        <AnimatePresence mode="popLayout">
          {isActive && (
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-5 tracking-tight leading-tight break-words pr-4"
            >
              {card.title}
            </motion.h2>
          )}
        </AnimatePresence>

        {/* Dynamic educational paragraphs */}
        <div className="space-y-3.5 pr-2 max-h-[35vh] overflow-y-auto hidden-scrollbar pointer-events-none">
          {card.paragraphs.map((para, idx) => (
            <AnimatePresence key={idx}>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.12, duration: 0.45 }}
                  className="font-serif text-[14px] md:text-[15px] font-normal text-[#1A1A1A]/80 leading-relaxed"
                >
                  {para}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: Key Takeaway + Hashtags */}
      <div className="relative z-10 text-left max-w-[390px] mx-auto w-full pt-1">
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="border-l-2 border-[#1A1A1A] pl-4 py-1.5 my-3 bg-[#F4F1EA]/70 text-left rounded-r-lg relative"
            >
              {/* Highlight icon spark */}
              <div className="absolute top-2.5 right-3 text-[#1A1A1A]/30">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="block font-sans text-[9px] font-black tracking-wider text-[#1A1A1A]/50 uppercase mb-0.5">
                Takeaway
              </span>
              <p className="font-serif text-[12px] font-medium leading-relaxed text-[#1A1A1A]/90 italic">
                {card.takeaway}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hash tags */}
        <div className="flex flex-wrap gap-1.5 pointer-events-none mb-2">
          {card.hashtags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] text-[#1A1A1A]/60 font-semibold bg-[#1A1A1A]/5 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ABSOLUTE INTERACTIONS BAR (Right Side) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-3.5 pointer-events-auto">
        
        {/* Like action */}
        <div className="flex flex-col items-center select-none">
          <motion.button
            id={`like-card-action-${card.id}`}
            onClick={triggerLikeAnimation}
            animate={likeAnimate ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              isLiked
                ? 'bg-red-500 border-red-600 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-md border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#F4F1EA]'
            } transition-all duration-200 outline-none shadow-sm`}
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          <span className="font-mono text-[9px] font-bold text-[#1A1A1A]/80 mt-0.5 pointer-events-none">
            {card.likesCount + (isLiked ? 1 : 0)}
          </span>
        </div>

        {/* Bookmark/Star action */}
        <div className="flex flex-col items-center select-none">
          <motion.button
            id={`bookmark-card-action-${card.id}`}
            onClick={triggerStarAnimation}
            animate={starAnimate ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              isBookmarked
                ? 'bg-amber-500 border-amber-650 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-md border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#F4F1EA]'
            } transition-all duration-200 outline-none shadow-sm`}
          >
            <Star className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
          <span className="font-mono text-[9px] font-bold text-[#1A1A1A]/80 mt-0.5 pointer-events-none">
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        </div>

        {/* Comment discussion action */}
        <div className="flex flex-col items-center select-none">
          <button
            id={`comment-card-action-${card.id}`}
            onClick={onCommentClick}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md text-[#1A1A1A] hover:bg-[#F4F1EA] transition-all duration-200 outline-none shadow-sm"
          >
            <MessageSquare className="h-4.5 w-4.5" />
          </button>
          <span className="font-mono text-[9px] font-bold text-[#1A1A1A]/80 mt-0.5 pointer-events-none">
            {card.commentsCount}
          </span>
        </div>

        {/* Share action */}
        <div className="flex flex-col items-center select-none">
          <button
            id={`share-card-action-${card.id}`}
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md text-[#1A1A1A] hover:bg-[#F4F1EA] transition-all duration-200 outline-none shadow-sm"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <span className="font-mono text-[9px] font-bold text-[#1A1A1A]/80 mt-0.5 pointer-events-none">
            Share
          </span>
        </div>
      </div>

      {/* Copy notification badge */}
      <AnimatePresence>
        {showShareSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute left-1/2 bottom-24 -translate-x-1/2 z-30 flex items-center space-x-1.5 rounded-full bg-[#1A1A1A] border border-white/12 px-4 py-2 text-white shadow-xl pointer-events-none"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-sans text-[11px] font-bold tracking-wide">
              Learning Card Copied!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
