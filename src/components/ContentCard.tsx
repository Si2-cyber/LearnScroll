/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Star, MessageSquare, Share2, Plus, Check,
  Award, Sparkles, ArrowLeft,
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
  onExpandedChange?: (isExpanded: boolean) => void;
}

export default function ContentCard({
  card, isLiked, isBookmarked, isSubscribed, isActive,
  onLike, onBookmark, onSubscribe, onCommentClick, onExpandedChange,
}: ContentCardProps) {
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [likeAnimate, setLikeAnimate] = useState(false);
  const [starAnimate, setStarAnimate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const triggerLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e); setLikeAnimate(true); setTimeout(() => setLikeAnimate(false), 300); onLike();
  };
  const triggerStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e); setStarAnimate(true); setTimeout(() => setStarAnimate(false), 300); onBookmark();
  };
  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    try { navigator.clipboard?.writeText(`📚 ${card.title}\n"${card.takeaway}"\nLearnScroll`); } catch {}
    setShowShareSuccess(true); setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const expandCard = () => { setIsExpanded(true); onExpandedChange?.(true); };
  const collapseCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e); setIsExpanded(false); onExpandedChange?.(false);
  };

  return (
    <>
      {/* ── EXPANDED OVERLAY — rendered on top, card below stays mounted ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-white mx-auto max-w-[440px] h-[100dvh]"
          >
            {/* Back button */}
            <motion.button
              onClick={collapseCard}
              title="Back"
              aria-label="Back to card"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-white/90 shadow-sm backdrop-blur-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto px-6 pt-20 pb-40 text-left"
              style={{ WebkitOverflowScrolling: 'touch' as any }}
            >
              <h2 className="font-display font-light text-4xl md:text-5xl text-[#1A1A1A] tracking-tight leading-tight mb-8 break-words">
                {card.title}
              </h2>
              <div className="space-y-5">
                {card.paragraphs.map((para, idx) => (
                  <p key={idx} className="font-serif text-[17px] md:text-[19px] text-[#1A1A1A]/80 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Pinned takeaway */}
            <div className="absolute bottom-0 inset-x-0 px-6 pb-6 pt-8 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
              <div className="border-l-2 border-[#1A1A1A] pl-3 py-1.5 bg-[#F4F1EA]/80 backdrop-blur-sm rounded-r-lg shadow-sm opacity-70">
                <span className="block font-sans text-[9px] font-black tracking-wider text-[#1A1A1A]/50 uppercase mb-0.5">Takeaway</span>
                <p className="font-serif text-[12px] font-medium leading-snug text-[#1A1A1A]/90 italic pr-6">{card.takeaway}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NORMAL CARD — always stays mounted in the feed ── */}
      <div
        id={`card-${card.id}`}
        onClick={expandCard}
        className="relative w-full h-full shrink-0 snap-start overflow-hidden select-none bg-white text-[#1A1A1A] cursor-pointer flex flex-col"
      >
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#1A1A1A]/10 pointer-events-none z-10" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-3 pointer-events-none">
          <div className="flex items-center space-x-2 pointer-events-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A]/5 border border-[#1A1A1A]/10">
              <Award className="h-4 w-4 text-[#1A1A1A]/70" />
            </div>
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-sans text-[11px] font-black tracking-wider text-[#1A1A1A] uppercase">@{card.channelName}</span>
                <span className="h-1 w-1 rounded-full bg-[#1A1A1A]/30" />
                <span className="rounded-full bg-[#1A1A1A] px-2.5 py-0.5 font-sans text-[9px] font-black tracking-[0.1em] uppercase text-white">{card.category}</span>
              </div>
              <p className="font-sans text-[9px] text-[#1A1A1A]/50 font-semibold uppercase tracking-wider">Academic Contributor</p>
            </div>
          </div>
          <button
            id={`subscribe-btn-${card.id}`}
            onClick={(e) => { stop(e); onSubscribe(); }}
            title={isSubscribed ? `Unsubscribe from ${card.channelName}` : `Subscribe to ${card.channelName}`}
            aria-label={isSubscribed ? `Unsubscribe from ${card.channelName}` : `Subscribe to ${card.channelName}`}
            className={`pointer-events-auto flex items-center space-x-1 rounded-md px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
              isSubscribed ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/70 border border-[#1A1A1A]/10' : 'bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#1A1A1A]/90'
            }`}
          >
            {isSubscribed
              ? <><Check className="h-2.5 w-2.5 text-emerald-600" /><span>Subscribed</span></>
              : <><Plus className="h-2.5 w-2.5" /><span>Subscribe</span></>}
          </button>
        </div>

        {/* Text content */}
        <div className="relative flex-1 overflow-hidden px-6 pr-14 pointer-events-none">
          <h2 className={`font-display font-light text-[#1A1A1A] tracking-tight leading-tight break-words mb-4 ${card.title.length > 40 ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
            {card.title}
          </h2>
          <div className="space-y-3">
            {card.paragraphs.map((para, idx) => (
              <p key={idx} className="font-serif text-[14px] md:text-[15px] text-[#1A1A1A]/80 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          {/* Gradient fade */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        {/* Bottom: Takeaway + hashtags */}
        <div className="relative z-10 px-6 pt-2 pb-6 pointer-events-none">
          <div className="border-l-2 border-[#1A1A1A] pl-3 py-1.5 mb-2 bg-[#F4F1EA]/80 backdrop-blur-sm rounded-r-lg shadow-sm">
            <div className="flex items-start justify-between">
              <span className="block font-sans text-[9px] font-black tracking-wider text-[#1A1A1A]/50 uppercase mb-0.5">Takeaway</span>
              <Sparkles className="h-3.5 w-3.5 text-[#1A1A1A]/30 shrink-0" />
            </div>
            <p className="font-serif text-[11px] md:text-[12px] font-medium leading-snug text-[#1A1A1A]/90 italic">{card.takeaway}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.hashtags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] text-[#1A1A1A]/60 font-semibold bg-[#1A1A1A]/5 px-2 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Right side action buttons */}
        <div
          onClick={stop}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-3.5 pointer-events-auto"
        >
          {[
            { id: `like-${card.id}`, onClick: triggerLike, animate: likeAnimate, active: isLiked, activeClass: 'bg-red-500 border-red-600 text-white', icon: <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />, label: String(card.likesCount + (isLiked ? 1 : 0)), tooltip: isLiked ? 'Unlike' : 'Like' },
            { id: `star-${card.id}`, onClick: triggerStar, animate: starAnimate, active: isBookmarked, activeClass: 'bg-amber-500 border-amber-600 text-white', icon: <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />, label: isBookmarked ? 'Saved' : 'Save', tooltip: isBookmarked ? 'Remove bookmark' : 'Save bookmark' },
            { id: `comment-${card.id}`, onClick: (e: React.MouseEvent<HTMLButtonElement>) => { stop(e); onCommentClick(); }, animate: false, active: false, activeClass: '', icon: <MessageSquare className="h-4 w-4" />, label: String(card.commentsCount), tooltip: 'Comment' },
            { id: `share-${card.id}`, onClick: handleShare, animate: false, active: false, activeClass: '', icon: <Share2 className="h-4 w-4" />, label: 'Share', tooltip: 'Share' },
          ].map((btn) => (
            <div key={btn.id} className="flex flex-col items-center select-none">
              <motion.button
                id={btn.id}
                onClick={btn.onClick}
                title={btn.tooltip}
                aria-label={btn.tooltip}
                animate={btn.animate ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 outline-none shadow-sm ${
                  btn.active ? btn.activeClass : 'bg-white/80 backdrop-blur-md border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#F4F1EA]'
                }`}
              >
                {btn.icon}
              </motion.button>
              <span className="font-mono text-[9px] font-bold text-[#1A1A1A]/80 mt-0.5">{btn.label}</span>
            </div>
          ))}
        </div>

        {/* Share toast */}
        <AnimatePresence>
          {showShareSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute left-1/2 bottom-24 -translate-x-1/2 z-30 flex items-center space-x-1.5 rounded-full bg-[#1A1A1A] px-4 py-2 text-white shadow-xl pointer-events-none"
            >
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-sans text-[11px] font-bold tracking-wide">Learning Card Copied!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}