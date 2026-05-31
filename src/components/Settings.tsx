/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key,
  Check,
  RotateCcw,
  BookOpen,
  Globe,
  HelpCircle,
  Brain,
  Music,
  Leaf,
  Landmark,
  Quote,
  Languages,
  Sparkles,
  Info,
  Trash2,
} from 'lucide-react';
import { Category, UserProfile } from '../types';

interface SettingsProps {
  profile: UserProfile;
  stats: {
    likedCount: number;
    bookmarkedCount: number;
    completionCount: number;
  };
  onUpdateApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onUpdateInterests: (interests: Category[]) => void;
  onResetData: () => void;
}

const TOPICS: { name: Category; icon: React.ComponentType<any>; color: string }[] = [
  { name: 'Book summaries', icon: BookOpen, color: 'text-blue-400 border-blue-500/10' },
  { name: 'Recent world news', icon: Globe, color: 'text-sky-400 border-sky-500/10' },
  { name: 'Trivia & fun facts', icon: HelpCircle, color: 'text-pink-400 border-pink-500/10' },
  { name: 'Study & focus tips', icon: Brain, color: 'text-rose-400 border-rose-500/10' },
  { name: 'Music recommendations', icon: Music, color: 'text-emerald-400 border-emerald-500/10' },
  { name: 'Science & nature facts', icon: Leaf, color: 'text-violet-400 border-violet-500/10' },
  { name: 'History highlights', icon: Landmark, color: 'text-yellow-400 border-yellow-500/10' },
  { name: 'Philosophy & quotes', icon: Quote, color: 'text-fuchsia-400 border-fuchsia-500/10' },
  { name: 'Language learning snippets', icon: Languages, color: 'text-teal-400 border-teal-500/10' },
  { name: 'Life skills & how-to tips', icon: Sparkles, color: 'text-indigo-400 border-indigo-500/10' },
];

export default function Settings({
  profile,
  stats,
  onUpdateApiKey,
  onClearApiKey,
  onUpdateInterests,
  onResetData,
}: SettingsProps) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isApiKeyEditing, setIsApiKeyEditing] = useState(!profile.openaiApiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleApiKeySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    onUpdateApiKey(apiKeyInput.trim());
    setApiKeyInput('');
    setIsApiKeyEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearApiKey = () => {
    onClearApiKey();
    setIsApiKeyEditing(true);
  };

  const toggleInterest = (interest: Category) => {
    const isAlreadySelected = profile.interests.includes(interest);
    let updated: Category[];
    if (isAlreadySelected) {
      // Ensure they maintain at least one topic of interest
      if (profile.interests.length <= 1) return;
      updated = profile.interests.filter((item) => item !== interest);
    } else {
      updated = [...profile.interests, interest];
    }
    onUpdateInterests(updated);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F1EA] text-[#1A1A1A] px-5 pb-24 pt-6 md:px-8">
      <div className="mx-auto w-full max-w-[480px] space-y-7">
        
        {/* Title */}
        <div className="pointer-events-none">
          <h1 className="font-display font-light text-2xl tracking-tight text-[#1A1A1A]">
            Profile Settings
          </h1>
          <p className="font-sans text-[11px] text-[#1A1A1A]/60 mt-1">
            Personalize your feeds, channels, and AI generation parameters.
          </p>
        </div>

        {/* User Badge & Stats */}
        <div className="rounded-xl border border-[#1A1A1A]/10 bg-white p-5 shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A] text-white text-base font-bold">
              {profile.username ? profile.username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-[#1A1A1A] leading-tight">
                @{profile.username || 'learn_scholar'}
              </h3>
              <p className="font-mono text-[9px] text-[#1A1A1A]/50 mt-0.5">
                {profile.email || 'guest@learnscroll.app'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-[#1A1A1A]/10 pt-4 mt-4 text-center pointer-events-none">
            <div className="rounded-lg bg-[#F4F1EA]/70 border border-[#1A1A1A]/5 p-2">
              <span className="block font-mono text-base font-bold text-[#1A1A1A]">
                {stats.likedCount}
              </span>
              <span className="font-sans text-[8px] text-[#1A1A1A]/50 tracking-wider font-extrabold uppercase">
                Likes
              </span>
            </div>
            <div className="rounded-lg bg-[#F4F1EA]/70 border border-[#1A1A1A]/5 p-2">
              <span className="block font-mono text-base font-bold text-[#1A1A1A]">
                {stats.bookmarkedCount}
              </span>
              <span className="font-sans text-[8px] text-[#1A1A1A]/50 tracking-wider font-extrabold uppercase">
                Bookmarks
              </span>
            </div>
            <div className="rounded-lg bg-[#F4F1EA]/70 border border-[#1A1A1A]/5 p-2">
              <span className="block font-mono text-base font-bold text-emerald-800">
                {stats.completionCount}
              </span>
              <span className="font-sans text-[8px] text-[#1A1A1A]/50 tracking-wider font-extrabold uppercase">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Bring Your Own Key Section */}
        <div className="rounded-xl border border-[#1A1A1A]/10 bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-2.5">
              <Key className="h-5 w-5 text-[#1A1A1A]/70" />
              <h2 className="font-sans text-[13px] font-bold tracking-tight text-[#1A1A1A]">
                OpenRouter API Key (BYOK)
              </h2>
            </div>
            <span className="rounded-full bg-[#1A1A1A]/5 px-2 py-0.5 font-sans text-[9px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
              OpenRouter
            </span>
          </div>

          <p className="font-sans text-[11px] text-[#1A1A1A]/60 leading-relaxed pointer-events-none">
            Custom real-time cards are generated via OpenRouter using your key. It's stored entirely inside your local browser storage and never touches external databases or servers.
          </p>

          <div className="rounded-lg bg-[#F4F1EA]/80 border border-[#1A1A1A]/10 p-3.5 flex items-start space-x-3 pointer-events-none">
            <Info className="h-4 w-4 text-[#1A1A1A]/70 shrink-0 mt-0.5" />
            <p className="font-sans text-[10px] text-[#1A1A1A]/75 leading-relaxed">
              <strong>Need a key?</strong> Access platform features offline with pre-seeded slides. Create an account at openrouter.ai/keys to generate your API keys.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isApiKeyEditing && profile.openaiApiKey ? (
              <motion.div
                key="saved-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3"
              >
                <div className="flex items-center space-x-2 pointer-events-none">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-800">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="block font-sans text-xs font-bold text-emerald-800">
                      Key Loaded & Secure
                    </span>
                    <span className="block font-mono text-[9px] text-[#1A1A1A]/50 mt-0.5">
                      sk-...{profile.openaiApiKey.substring(profile.openaiApiKey.length - 4)}
                    </span>
                  </div>
                </div>

                <button
                  id="clear-api-key-button"
                  onClick={handleClearApiKey}
                  className="rounded-md bg-red-500/10 px-2.5 py-1.5 font-sans text-[10px] font-bold text-red-700 hover:bg-red-500/20 transition-colors"
                >
                  Remove Key
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form-state"
                onSubmit={handleApiKeySave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    id="api-key-input-field"
                    type="password"
                    placeholder="Paste OpenRouter Key (sk-or-...)"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 rounded-lg border border-[#1A1A1A]/10 bg-white px-3 py-2 font-mono text-xs text-[#1A1A1A] placeholder-gray-400 outline-none transition-all focus:border-[#1A1A1A]/30"
                  />
                  <button
                    id="save-api-key-button"
                    type="submit"
                    disabled={!apiKeyInput.trim()}
                    className="rounded-lg bg-[#1A1A1A] px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#1A1A1A]/90 active:scale-95 disabled:opacity-45 disabled:hover:bg-[#1A1A1A] cursor-pointer"
                  >
                    Save
                  </button>
                </div>
                {profile.openaiApiKey && (
                  <button
                    id="cancel-key-editing"
                    type="button"
                    onClick={() => setIsApiKeyEditing(false)}
                    className="font-sans text-[10px] tracking-wide text-gray-500 underline decoration-gray-400 h-6 block"
                  >
                    Use current key
                  </button>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2 text-center pointer-events-none"
              >
                <p className="font-sans text-xs font-semibold text-emerald-800">
                  ⚡ API key saved and activated locally.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Settings Selection */}
        <div className="rounded-xl border border-[#1A1A1A]/10 bg-white p-5 space-y-4 shadow-sm">
          <div className="pointer-events-none">
            <h2 className="font-sans text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
              Active Topics
            </h2>
            <p className="font-sans text-[11px] text-[#1A1A1A]/60">
              Pick themes you want to include. Minimum of 1 must remain active.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            {TOPICS.map((topic) => {
              const isActive = profile.interests.includes(topic.name);
              const Icon = topic.icon;

              return (
                <button
                  key={topic.name}
                  onClick={() => toggleInterest(topic.name)}
                  className={`flex items-center space-x-2 rounded-lg border px-3 py-2.5 transition-all outline-none duration-200 ${
                    isActive
                      ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 shadow-sm'
                      : 'border-[#1A1A1A]/10 bg-white hover:border-[#1A1A1A]/20'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/50'}`} />
                  <span className="font-sans text-[10px] font-bold text-[#1A1A1A] truncate pointer-events-none">
                    {topic.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Storage Options */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 space-y-4 shadow-sm">
          <div className="pointer-events-none">
            <h2 className="font-sans text-xs font-black tracking-wider text-red-700 uppercase mb-1">
              Danger Zone
            </h2>
            <p className="font-sans text-[11px] text-red-700/60 font-medium">
              Clear dynamic tracking metrics, comments, profile values, and your stored API key.
            </p>
          </div>

          {!showConfirmReset ? (
            <button
              id="confirm-reset-trigger"
              onClick={() => setShowConfirmReset(true)}
              className="flex w-full items-center justify-center space-x-2 rounded-lg border border-red-200 bg-white py-3 hover:bg-red-50 text-red-700 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-red-700" />
              <span className="font-sans text-xs font-bold text-red-800">
                Reset Application State
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="font-sans text-[11px] text-red-950/80 leading-relaxed font-semibold">
                Are you absolutely sure? This will delete all saved bookmarks, custom generated feed items, liking histories, comments, and your stored API key.
              </p>
              <div className="flex gap-2">
                <button
                  id="execute-system-reset"
                  onClick={() => {
                    onResetData();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 rounded-lg bg-red-700 hover:bg-red-800 py-3 font-sans text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  id="cancel-system-reset"
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 rounded-lg border border-[#1A1A1A]/10 bg-white hover:bg-[#F4F1EA] py-3 font-sans text-xs font-bold text-[#1A1A1A]/70 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
