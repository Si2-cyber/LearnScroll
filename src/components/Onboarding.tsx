/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
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
  ChevronRight,
} from 'lucide-react';
import { Category } from '../types';

interface OnboardingProps {
  onComplete: (selectedCategories: Category[]) => void;
}

interface TopicOption {
  name: Category;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const TOPICS: TopicOption[] = [
  {
    name: 'Book summaries',
    description: 'Bite-sized summaries of life-changing literature.',
    icon: BookOpen,
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    name: 'Recent world news',
    description: 'Factual news digests of key worldwide events.',
    icon: Globe,
    color: 'from-sky-500/20 to-teal-500/20',
  },
  {
    name: 'Trivia & fun facts',
    description: 'Surprising answers to natural curiosities of life.',
    icon: HelpCircle,
    color: 'from-pink-500/20 to-purple-500/20',
  },
  {
    name: 'Study & focus tips',
    description: 'Cognitive techniques to boost deep attention capacity.',
    icon: Brain,
    color: 'from-rose-500/20 to-orange-500/20',
  },
  {
    name: 'Music recommendations',
    description: 'Curations of audio designed to trigger the flow state.',
    icon: Music,
    color: 'from-emerald-500/20 to-green-500/20',
  },
  {
    name: 'Science & nature facts',
    description: 'Fascinating discoveries inside our cosmos and biology.',
    icon: Leaf,
    color: 'from-violet-500/20 to-indigo-500/20',
  },
  {
    name: 'History highlights',
    description: 'Crucial turning points, manuscripts, and discoveries.',
    icon: Landmark,
    color: 'from-yellow-500/20 to-amber-500/20',
  },
  {
    name: 'Philosophy & quotes',
    description: 'Timeless guidance from history\'s greatest deep thinkers.',
    icon: Quote,
    color: 'from-fuchsia-500/20 to-rose-500/20',
  },
  {
    name: 'Language learning snippets',
    description: 'Idiomatic expressions, roots, and linguistic history.',
    icon: Languages,
    color: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    name: 'Life skills & how-to tips',
    description: 'Practical tactics and financial planning structures.',
    icon: Sparkles,
    color: 'from-indigo-500/20 to-purple-500/20',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selected, setSelected] = useState<Category[]>([]);

  const toggleTopic = (topic: Category) => {
    setSelected((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleNext = () => {
    if (selected.length > 0) {
      onComplete(selected);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-[#F4F1EA] text-[#1A1A1A] px-5 py-8 md:px-8">
      {/* Upper Content */}
      <div className="mx-auto w-full max-w-[480px] flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pointer-events-none"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/10 mb-4 ">
            <Brain className="h-6 w-6" />
          </div>
          <h1 className="font-display font-light text-3xl md:text-4xl text-[#1A1A1A] mb-2 leading-tight">
            Curate Your Syllabus
          </h1>
          <p className="font-sans text-xs text-[#1A1A1A]/60 max-w-[360px] mx-auto leading-relaxed">
            Choose the specific disciplines you wish to master. LearnScroll strict-filters academic summaries, worldview facts, and cognitive tools for pure learning.
          </p>
        </motion.div>

        {/* List of Grid Items */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 pb-4 hidden-scrollbar">
          {TOPICS.map((topic, index) => {
            const isSelected = selected.includes(topic.name);
            const Icon = topic.icon;

            return (
              <motion.button
                key={topic.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => toggleTopic(topic.name)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-300 outline-none text-left ${
                  isSelected
                    ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 shadow-sm'
                    : 'border-[#1A1A1A]/10 bg-white hover:border-[#1A1A1A]/25'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A]/5 ${
                      isSelected ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/60'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-bold text-[#1A1A1A]">
                      {topic.name}
                    </h3>
                    <p className="font-sans text-xs text-[#1A1A1A]/60 mt-0.5 line-clamp-1">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white scale-110'
                      : 'border-[#1A1A1A]/20'
                  }`}
                >
                  {isSelected && (
                    <span className="h-1.5 w-1.5 bg-[#F4F1EA] rounded-full" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Button footer */}
      <div className="mx-auto w-full max-w-[480px] bg-[#F4F1EA]/90 pt-4 pb-2 backdrop-blur-md">
        <button
          id="oncoding-continue-button"
          disabled={selected.length === 0}
          onClick={handleNext}
          className={`flex w-full items-center justify-center rounded-xl py-3.5 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            selected.length > 0
              ? 'bg-[#1A1A1A] text-[#F4F1EA] shadow-md hover:bg-[#1A1A1A]/90 active:scale-98 cursor-pointer'
              : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/40 cursor-not-allowed border border-[#1A1A1A]/10'
          }`}
        >
          <span>
            {selected.length === 0
              ? 'Select at least 1 topic'
              : `Start Learning (${selected.length} Topic${selected.length !== 1 ? 's' : ''})`}
          </span>
          {selected.length > 0 && <ChevronRight className="h-4 w-4 ml-1.5" />}
        </button>
      </div>
    </div>
  );
}
