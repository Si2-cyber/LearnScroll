/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User } from 'lucide-react';
import { Comment } from '../types';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function CommentDrawer({
  isOpen,
  onClose,
  cardId,
  comments,
  onAddComment,
}: CommentDrawerProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="comment-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#1A1A1A]/60"
          />

          {/* Drawer content */}
          <motion.div
            id="comment-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[70vh] w-full max-w-[480px] flex-col rounded-t-2xl border-t border-[#1A1A1A]/10 bg-white text-[#1A1A1A] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 px-5 py-4">
              <div className="flex flex-col">
                <h3 className="font-display font-light text-xl text-[#1A1A1A]">
                  Discussion
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#1A1A1A]/50">
                  {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                id="close-comment"
                onClick={onClose}
                title="Close comments"
                aria-label="Close comments"
                className="rounded-full p-1.5 transition-colors duration-200 hover:bg-[#1A1A1A]/5"
              >
                <X className="h-4.5 w-4.5 text-[#1A1A1A]/60" />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {comments.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
                  <span className="mb-2 text-2xl">💡</span>
                  <p className="font-sans text-sm text-[#1A1A1A] font-bold">
                    Be the first to share your thoughts!
                  </p>
                  <p className="font-serif text-xs text-[#1A1A1A]/65 mt-1">
                    What does this learning make you think about?
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-3 border-b border-[#1A1A1A]/5 pb-3 last:border-b-0"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] font-bold border border-[#1A1A1A]/15 text-xs">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between pointer-events-none">
                        <span className="font-sans text-xs font-black text-[#1A1A1A]">
                          {comment.username}
                        </span>
                        <span className="font-mono text-[9px] text-[#1A1A1A]/40">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="font-serif text-[13px] text-[#1A1A1A]/80 mt-0.5 pointer-events-none leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-[#1A1A1A]/10 bg-white/95 px-4 py-4 backdrop-blur-md"
            >
              <div className="flex items-center space-x-2">
                <input
                  id="new-comment-input"
                  type="text"
                  placeholder="Share your perspective..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 rounded-lg border border-[#1A1A1A]/12 bg-white px-4 py-2.5 font-sans text-xs text-[#1A1A1A] placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1A1A1A]/25"
                />
                <button
                  id="submit-comment-button"
                  type="submit"
                  disabled={!commentText.trim()}
                  title="Send comment"
                  aria-label="Send comment"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1A1A] text-white transition-all duration-200 hover:bg-[#1A1A1A]/90 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
