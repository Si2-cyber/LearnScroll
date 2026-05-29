/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bookmark,
  Sliders,
  ChevronDown,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Card, Comment, UserProfile, Category } from './types';
import { DEFAULT_CARDS } from './data/defaultCards';
import Onboarding from './components/Onboarding';
import ContentCard from './components/ContentCard';
import BookmarkView from './components/BookmarkView';
import Settings from './components/Settings';
import CommentDrawer from './components/CommentDrawer';

export default function App() {
  // --- 1. LOCAL STORAGE & PERSISTENCE INITIALIZATION ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('learnscroll_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // clear and fallback
      }
    }
    return {
      username: 'scholar_learner',
      email: 'user@learnscroll.app',
      interests: [],
      subscribedChannels: [],
    };
  });

  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('learnscroll_custom_cards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return [...DEFAULT_CARDS, ...parsed];
        }
      } catch (e) {}
    }
    return DEFAULT_CARDS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('learnscroll_comments');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedCardIds, setLikedCardIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('learnscroll_likes');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedCardIds, setBookmarkedCardIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('learnscroll_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedCardIds, setCompletedCardIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('learnscroll_completed_reads');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation tab state: 'explore' | 'bookmarks' | 'settings'
  const [activeTab, setActiveTab] = useState<'explore' | 'bookmarks' | 'settings'>('explore');

  // Slide comments drawer state
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [commentDrawerCardId, setCommentDrawerCardId] = useState<string | null>(null);

  // Active indices in exploring feed
  const [activeIndex, setActiveIndex] = useState(0);

  // OpenAI Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Scroll Sync Refs
  const feedScrollRef = useRef<HTMLDivElement>(null);

  // --- 2. EFFECT HOOKS FOR LOCALSTORAGE LOGS ---
  useEffect(() => {
    localStorage.setItem('learnscroll_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const customOnly = cards.filter((c) => !c.id.startsWith('seed-'));
    localStorage.setItem('learnscroll_custom_cards', JSON.stringify(customOnly));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('learnscroll_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('learnscroll_likes', JSON.stringify(likedCardIds));
  }, [likedCardIds]);

  useEffect(() => {
    localStorage.setItem('learnscroll_bookmarks', JSON.stringify(bookmarkedCardIds));
  }, [bookmarkedCardIds]);

  useEffect(() => {
    localStorage.setItem('learnscroll_completed_reads', JSON.stringify(completedCardIds));
  }, [completedCardIds]);

  // --- 3. ONBOARDING COMPLETION TRIGGER ---
  const handleOnboardingComplete = (selectedInterests: Category[]) => {
    setProfile((prev) => ({
      ...prev,
      interests: selectedInterests,
    }));
  };

  // --- 4. DYNAMIC FEED FILTERING ---
  // If user is onboarded, prioritize their category selection.
  // Fallback to all categories if they select everything or reset.
  const filteredFeedCards = cards.filter((card) => {
    if (profile.interests.length === 0) return true;
    return profile.interests.includes(card.category);
  });

  // Track the active card's index and mark it as completed/read
  useEffect(() => {
    if (filteredFeedCards.length > 0 && activeIndex < filteredFeedCards.length) {
      const activeCard = filteredFeedCards[activeIndex];
      if (activeCard && !completedCardIds.includes(activeCard.id)) {
        setCompletedCardIds((prev) => [...prev, activeCard.id]);
      }
    }
  }, [activeIndex, filteredFeedCards]);

  // --- 5. INTERACTING HANDLERS ---
  const handleLikeCard = (cardId: string) => {
    setLikedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const handleBookmarkCard = (cardId: string) => {
    setBookmarkedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const handleSubscribeChannel = (channelName: string) => {
    setProfile((prev) => {
      const isSubbed = prev.subscribedChannels.includes(channelName);
      const updated = isSubbed
        ? prev.subscribedChannels.filter((ch) => ch !== channelName)
        : [...prev.subscribedChannels, channelName];
      return { ...prev, subscribedChannels: updated };
    });
  };

  const handleOpenComments = (cardId: string) => {
    setCommentDrawerCardId(cardId);
    setCommentDrawerOpen(true);
  };

  const handleAddComment = (commentText: string) => {
    if (!commentDrawerCardId) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      cardId: commentDrawerCardId,
      username: profile.username || 'curious_mind',
      text: commentText,
      timestamp: 'Just now',
    };

    setComments((prev) => [newComment, ...prev]);

    // Update comment counter in the cards state
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === commentDrawerCardId ? { ...c, commentsCount: c.commentsCount + 1 } : c
      )
    );
  };

  // --- 6. INTUITIVE NAVIGATION SWITCH FROM BOOKMARKS ---
  const handleViewInFeed = (cardId: string) => {
    setActiveTab('explore');
    // Find index of this card in our filtered explore list
    const cardIdx = filteredFeedCards.findIndex((c) => c.id === cardId);
    if (cardIdx !== -1) {
      setActiveIndex(cardIdx);
      setTimeout(() => {
        if (feedScrollRef.current) {
          const clientHeight = feedScrollRef.current.clientHeight;
          feedScrollRef.current.scrollTop = cardIdx * clientHeight;
        }
      }, 100);
    } else {
      // If card isn't in filtered list, we must temporarily add its category to active interests
      const targetCard = cards.find((c) => c.id === cardId);
      if (targetCard) {
        setProfile((prev) => {
          if (!prev.interests.includes(targetCard.category)) {
            return { ...prev, interests: [...prev.interests, targetCard.category] };
          }
          return prev;
        });
        setTimeout(() => {
          const freshFiltered = cards.filter((card) => {
            if (profile.interests.length === 0) return true;
            return [...profile.interests, targetCard.category].includes(card.category);
          });
          const freshIdx = freshFiltered.findIndex((c) => c.id === cardId);
          if (freshIdx !== -1) {
            setActiveIndex(freshIdx);
            if (feedScrollRef.current) {
              const clientHeight = feedScrollRef.current.clientHeight;
              feedScrollRef.current.scrollTop = freshIdx * clientHeight;
            }
          }
        }, 150);
      }
    }
  };

  // --- 7. OPENAI AI INTEGRATION / LIVE CARD GENERATOR ---
  const handleGenerateLiveCard = async () => {
    if (!profile.openaiApiKey) {
      setGenError('Please set your OpenAI API key in parameters first!');
      return;
    }

    setIsGenerating(true);
    setGenError(null);

    const categoriesList = profile.interests.length > 0 ? profile.interests : DEFAULT_CARDS.map((c) => c.category);
    const selectedCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${profile.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an elite, focused GPT-4 educator creating bite-sized slides for LearnScroll.
Your output MUST be a valid JSON object matching this schema:
{
  "title": "A catchy, intriguing, short title (2-6 words)",
  "category": "The category requested by the user",
  "paragraphs": [
    "A 1-to-2 sentence paragraph establishing a fascinating premise.",
    "A 1-to-2 sentence paragraph providing core scientific, historical, or practical substance.",
    "A final 1-to-2 sentence paragraph cementing an advanced nuance or deeper context."
  ],
  "takeaway": "A concise, memorable 1-sentence bottom-line takeaway summary.",
  "hashtags": ["List of 2 to 3 academic hashtags without the hash symbol"],
  "backgroundColor": "A selected elegant dark background hex code (comfortable dark reading, e.g. #0F172A, #111827, #064E3B, #1B365D, #2D0B3D, #2E1A47, #371D1D)",
  "channelName": "A clever 1-word or 2-word themed creator handle, e.g. 'BioSphere', 'HistoLab', 'EcoStudy', 'BrainSync'"
}`,
            },
            {
              role: 'user',
              content: `Generate a brand new, highly educational bite-sized card on the following category: "${selectedCategory}". Enforce strict intellectual value. Exclude gaming, memes, celebrity gossip, and hollow entertainment elements.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed connecting to OpenAI API');
      }

      const rawJson = await response.json();
      const content = rawJson.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('API returned an empty payload');
      }

      const parsed = JSON.parse(content);

      const generatedCard: Card = {
        id: `ai-card-${Date.now()}`,
        title: parsed.title,
        category: parsed.category || selectedCategory,
        paragraphs: parsed.paragraphs || [],
        takeaway: parsed.takeaway || 'Knowledge is compounding.',
        hashtags: parsed.hashtags || ['Learning'],
        backgroundColor: parsed.backgroundColor || '#1E293B',
        channelName: parsed.channelName || 'AICurator',
        likesCount: 0,
        commentsCount: 0,
      };

      // Add to cards. Place at the end of pre-seeded cards so it appends nicely.
      setCards((prev) => [...prev, generatedCard]);

      // Scroll smoothly to this newly generated card
      setTimeout(() => {
        const itemIdx = filteredFeedCards.length; // Approximate position
        setActiveIndex(itemIdx);
        if (feedScrollRef.current) {
          const clientHeight = feedScrollRef.current.clientHeight;
          feedScrollRef.current.scrollTop = feedScrollRef.current.scrollHeight;
        }
      }, 150);
    } catch (e: any) {
      console.error(e);
      setGenError(e?.message || 'Error occurred during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 8. PRESET ACTIONS AND RESTORATION ---
  const handleUpdateApiKey = (key: string) => {
    setProfile((prev) => ({ ...prev, openaiApiKey: key }));
  };

  const handleClearApiKey = () => {
    setProfile((prev) => ({ ...prev, openaiApiKey: undefined }));
  };

  const handleUpdateInterests = (interests: Category[]) => {
    setProfile((prev) => ({ ...prev, interests }));
  };

  const handleResetData = () => {
    localStorage.removeItem('learnscroll_profile');
    localStorage.removeItem('learnscroll_custom_cards');
    localStorage.removeItem('learnscroll_comments');
    localStorage.removeItem('learnscroll_likes');
    localStorage.removeItem('learnscroll_bookmarks');
    localStorage.removeItem('learnscroll_completed_reads');

    setProfile({
      username: 'scholar_learner',
      email: 'user@learnscroll.app',
      interests: [],
      subscribedChannels: [],
    });
    setCards(DEFAULT_CARDS);
    setComments([]);
    setLikedCardIds([]);
    setBookmarkedCardIds([]);
    setCompletedCardIds([]);
    setActiveIndex(0);
    setActiveTab('explore');
  };

  // Calculate stats for Settings Profile
  const calculatedStats = {
    likedCount: likedCardIds.length,
    bookmarkedCount: bookmarkedCardIds.length,
    completionCount: completedCardIds.length,
  };

  // --- 9. RENDER BRANCHES ---
  // Onboarding Screen trigger
  if (profile.interests.length === 0) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen w-full flex-col justify-between bg-[#F4F1EA] text-[#1A1A1A] antialiased overflow-hidden select-none">
      
      {/* APP HEADER */}
      <header className="flex h-16 w-full items-center justify-between border-b border-[#1A1A1A]/10 bg-[#F4F1EA]/95 px-5 md:px-8 shrink-0 z-30">
        <div className="flex items-center space-x-2 pointer-events-none">
          <span className="text-[#1A1A1A] font-display font-light text-2xl tracking-tight">
            LearnScroll
          </span>
          <span className="rounded bg-[#1A1A1A] text-white font-sans font-bold text-[9.5px] px-1.5 py-0.5 uppercase tracking-wider">
            HQ
          </span>
        </div>

        {/* Live GPT API Status Badge */}
        {profile.openaiApiKey ? (
          <button
            id="status-badge-loaded"
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/30 px-3 py-1.5 hover:bg-emerald-550/10 transition-colors duration-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-sans text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
              GPT-4 Live
            </span>
          </button>
        ) : (
          <button
            id="status-badge-offline"
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-1.5 rounded-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-3 py-1.5 hover:bg-[#1A1A1A]/10 transition-colors duration-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A1A1A]/60" />
            <span className="font-sans text-[10px] font-extrabold text-[#1A1A1A]/75 uppercase tracking-wider">
              Pre-seeded
            </span>
          </button>
        )}
      </header>

      {/* CORE VIEWPORT SHELL */}
      <main className="flex-1 w-full mx-auto max-w-[440px] bg-white border-x border-[#1A1A1A]/10 md:shadow-[0_20px_50px_-10px_rgba(26,26,26,0.08)] relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* TAP EXPLORE VIEW */}
          {activeTab === 'explore' && (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col relative"
            >
              {filteredFeedCards.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <AlertCircle className="h-10 w-10 text-indigo-400 mb-3" />
                  <h3 className="font-sans text-sm font-bold text-white">No active topics found</h3>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed mt-2">
                    Activate relevant topics inside settings to begin compiling your customized short-form syllabus channel feed.
                  </p>
                  <button
                    id="fallback-settings-nav"
                    onClick={() => setActiveTab('settings')}
                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 font-sans text-xs font-bold text-white"
                  >
                    Adjust Topics
                  </button>
                </div>
              ) : (
                <div
                  ref={feedScrollRef}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollTop = container.scrollTop;
                    const clientHeight = container.clientHeight;
                    const newIndex = Math.round(scrollTop / clientHeight);
                    if (newIndex !== activeIndex) {
                      setActiveIndex(newIndex);
                    }
                  }}
                  className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth flex flex-col hidden-scrollbar relative bg-white"
                >
                  {filteredFeedCards.map((card, idx) => (
                    <ContentCard
                      key={card.id}
                      card={card}
                      isLiked={likedCardIds.includes(card.id)}
                      isBookmarked={bookmarkedCardIds.includes(card.id)}
                      isSubscribed={profile.subscribedChannels.includes(card.channelName)}
                      isActive={idx === activeIndex && activeTab === 'explore'}
                      onLike={() => handleLikeCard(card.id)}
                      onBookmark={() => handleBookmarkCard(card.id)}
                      onSubscribe={() => handleSubscribeChannel(card.channelName)}
                      onCommentClick={() => handleOpenComments(card.id)}
                    />
                  ))}

                  {/* END SLIDE IN EXPLORING FEED */}
                  <div className="relative shrink-0 snap-start h-full w-full flex flex-col justify-center items-center text-center bg-white p-6 pointer-events-auto select-none border-t border-[#1A1A1A]/10">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-[#1A1A1A] mb-4">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-light text-xl text-[#1A1A1A] tracking-tight">
                      End of Pre-seeded Curriculum
                    </h3>
                    <p className="font-sans text-xs text-[#1A1A1A]/60 leading-relaxed max-w-[280px] mx-auto mt-2">
                      {profile.openaiApiKey
                        ? 'Generate fully unique, fresh custom lessons using GPT-4o Mini below!'
                        : 'Unlock endless personalized summaries, world news facts, or study hacks by saving an OpenAI Key in parameters!'}
                    </p>

                    <div className="mt-6 space-y-3 w-full max-w-[280px]">
                      {profile.openaiApiKey ? (
                        <button
                          id="end-slide-generate"
                          disabled={isGenerating}
                          onClick={handleGenerateLiveCard}
                          className="flex p-3 w-full items-center justify-center space-x-2 rounded-lg bg-[#1A1A1A] text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#1A1A1A]/90 disabled:opacity-45 transition-all text-center shrink-0 cursor-pointer shadow-sm"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Synthesizing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Generate New Slide</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          id="end-slide-setup-key"
                          onClick={() => setActiveTab('settings')}
                          className="flex w-full items-center justify-center space-x-2 rounded-lg border border-[#1A1A1A]/15 bg-[#1A1A1A]/5 px-4 py-3 font-sans text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A]/10 transition-all text-center cursor-pointer"
                        >
                          <span>Install OpenAI API Key</span>
                        </button>
                      )}

                      {genError && (
                        <p className="font-sans text-[10px] font-bold text-red-700 border border-red-500/15 rounded-lg p-2.5 bg-red-50">
                          ⚠️ {genError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAP BOOKMARKS SYLLABUS COLLECTION VIEW */}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full overflow-y-auto hidden-scrollbar"
            >
              <BookmarkView
                bookmarkedCards={cards.filter((c) => bookmarkedCardIds.includes(c.id))}
                onRemoveBookmark={handleBookmarkCard}
                onViewInFeed={handleViewInFeed}
              />
            </motion.div>
          )}

          {/* TAP SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full overflow-y-auto hidden-scrollbar"
            >
              <Settings
                profile={profile}
                stats={calculatedStats}
                onUpdateApiKey={handleUpdateApiKey}
                onClearApiKey={handleClearApiKey}
                onUpdateInterests={handleUpdateInterests}
                onResetData={handleResetData}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* FLOATING QUICK GENERATE BUTTON FOR LOGGED IN USERS */}
        {activeTab === 'explore' && profile.openaiApiKey && !isGenerating && (
          <motion.button
            id="floating-gen-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleGenerateLiveCard}
            className="absolute bottom-4 right-4 z-20 flex h-10 items-center space-x-1.5 rounded-lg bg-[#1A1A1A] border border-[#1A1A1A]/20 px-3 text-white shadow-lg cursor-pointer hover:bg-[#1A1A1A]/90 transition-all"
            title="Generate Live GPT Card"
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span className="font-sans text-[11px] font-bold tracking-tight">
              Gen Slide
            </span>
          </motion.button>
        )}

        {/* FLOATING GENERATING LOADER */}
        {isGenerating && (
          <div className="absolute inset-x-4 bottom-4 z-20 rounded-lg bg-white border border-[#1A1A1A]/15 px-4 py-3 text-[#1A1A1A] flex items-center justify-between shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-2.5">
              <Loader2 className="h-4 w-4 text-[#1A1A1A] animate-spin" />
              <span className="font-sans text-xs font-bold">
                Synthesizing custom learning module...
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#1A1A1A]/50 animate-pulse">
              gpt-4o-mini
            </span>
          </div>
        )}
      </main>

      {/* GLOBAL FOOTER: GLASSMORPHISM TABS BAR */}
      <footer className="h-16 w-full border-t border-[#1A1A1A]/10 bg-[#FFFFFF] px-4 flex items-center justify-around shrink-0 z-30 mx-auto max-w-[440px] border-x">
        
        {/* Explore Card tab */}
        <button
          id="nav-explore"
          onClick={() => {
            setActiveTab('explore');
            // Slight delay sync for scroll snaps if returning to explore
            setTimeout(() => {
              if (feedScrollRef.current) {
                const clientHeight = feedScrollRef.current.clientHeight;
                feedScrollRef.current.scrollTop = activeIndex * clientHeight;
              }
            }, 60);
          }}
          className={`flex flex-col items-center justify-center w-20 py-1 transition-colors outline-none cursor-pointer ${
            activeTab === 'explore' ? 'text-[#1A1A1A] font-black' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
          }`}
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span className="font-sans text-[9.5px] mt-1 font-bold uppercase tracking-wider">Explore</span>
        </button>

        {/* Syllabus / Bookmarks tab */}
        <button
          id="nav-bookmarks"
          onClick={() => setActiveTab('bookmarks')}
          className={`flex flex-col items-center justify-center w-20 py-1 transition-colors outline-none cursor-pointer ${
            activeTab === 'bookmarks' ? 'text-[#1A1A1A] font-black' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
          }`}
        >
          <Bookmark className="h-4.5 w-4.5" />
          <span className="font-sans text-[9.5px] mt-1 font-bold uppercase tracking-wider">Syllabus</span>
        </button>

        {/* Profile Settings tab */}
        <button
          id="nav-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center w-20 py-1 transition-colors outline-none cursor-pointer ${
            activeTab === 'settings' ? 'text-[#1A1A1A] font-black' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
          }`}
        >
          <Sliders className="h-4.5 w-4.5" />
          <span className="font-sans text-[9.5px] mt-1 font-bold uppercase tracking-wider">Parameters</span>
        </button>
      </footer>

      {/* FLOATING COMMENTS TRAY */}
      <CommentDrawer
        isOpen={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        cardId={commentDrawerCardId || ''}
        comments={comments.filter((c) => c.cardId === commentDrawerCardId)}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
