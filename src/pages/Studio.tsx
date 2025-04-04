import React, { useState, useEffect, useRef } from 'react';
import { FaImage, FaTag, FaTimes, FaCode, FaPlus } from 'react-icons/fa';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// Add Twitter types
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => Promise<void>;
        createTweet: (tweetId: string, element: HTMLElement, options?: any) => Promise<void>;
      };
    };
  }
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'update' | 'announcement' | 'development';
  image: string;
  source: string;
}

interface ContentForm {
  title: string;
  description: string;
  source: string;
  image: string;
  keywords: string[];
  trending: boolean;
  iframeUrl: string;
  embedType: 'twitter' | 'iframe' | null;
  embedOptions: {
    hideThread?: boolean;
    hideMedia?: boolean;
    theme?: 'light' | 'dark';
    align?: 'left' | 'center' | 'right';
  };
  timelineEvents: TimelineEvent[];
}

type TimelineView = 'week' | 'month' | 'year';

export default function Studio() {
  const [content, setContent] = useState<ContentForm>({
    title: '',
    description: '',
    source: '',
    image: '',
    keywords: [],
    trending: false,
    iframeUrl: '',
    embedType: null,
    embedOptions: {
      theme: 'dark',
      align: 'center',
      hideThread: false,
      hideMedia: false
    },
    timelineEvents: []
  });
  
  const [keyword, setKeyword] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [showIframePreview, setShowIframePreview] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [timelineEvent, setTimelineEvent] = useState<Partial<TimelineEvent>>({
    type: 'update'
  });
  const [timelineView, setTimelineView] = useState<TimelineView>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const tweetContainerRef = useRef<HTMLDivElement>(null);

  // Load Twitter widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    
    script.onload = () => {
      if (showIframePreview && content.embedType === 'twitter') {
        loadTweet();
      }
    };
    
    if (!window.twttr) {
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  // Function to extract tweet ID from URL
  const extractTweetId = (url: string) => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  // Function to detect embed type from URL
  const detectEmbedType = (url: string): 'twitter' | 'iframe' | null => {
    if (!url) return null;
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    return 'iframe';
  };

  // Function to load tweet
  const loadTweet = async () => {
    if (!content.iframeUrl || !tweetContainerRef.current) return;
    
    const tweetId = extractTweetId(content.iframeUrl);
    if (!tweetId) return;

    // Clear previous content
    tweetContainerRef.current.innerHTML = '';

    if (window.twttr) {
      try {
        await window.twttr.widgets.createTweet(
          tweetId,
          tweetContainerRef.current,
          {
            theme: content.embedOptions.theme,
            align: content.embedOptions.align,
            conversation: content.embedOptions.hideThread ? 'none' : 'all',
            cards: content.embedOptions.hideMedia ? 'hidden' : 'visible'
          }
        );
      } catch (error) {
        console.error('Error loading tweet:', error);
        tweetContainerRef.current.innerHTML = '<p class="text-red-500">Error loading tweet. Please check the URL and try again.</p>';
      }
    }
  };

  // Effect to load tweet when URL changes or preview is shown
  useEffect(() => {
    if (showIframePreview && content.embedType === 'twitter') {
      loadTweet();
    }
  }, [showIframePreview, content.iframeUrl, content.embedOptions]);

  const handleUrlChange = (url: string) => {
    const embedType = detectEmbedType(url);
    setContent(prev => ({
      ...prev,
      iframeUrl: url,
      embedType
    }));
  };

  const handleIframePreview = () => {
    if (content.iframeUrl) {
      setShowIframePreview(true);
    }
  };

  const getDateRange = () => {
    switch (timelineView) {
      case 'week':
        return {
          start: startOfWeek(selectedDate),
          end: endOfWeek(selectedDate)
        };
      case 'month':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate)
        };
      case 'year':
        return {
          start: startOfYear(selectedDate),
          end: endOfYear(selectedDate)
        };
    }
  };

  const getFilteredEvents = () => {
    const { start, end } = getDateRange();
    return content.timelineEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= start && eventDate <= end;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Content to submit:', content);
    setContent({
      title: '',
      description: '',
      source: '',
      image: '',
      keywords: [],
      trending: false,
      iframeUrl: '',
      embedType: null,
      embedOptions: {
        theme: 'dark',
        align: 'center',
        hideThread: false,
        hideMedia: false
      },
      timelineEvents: []
    });
    setPreview(null);
    setShowIframePreview(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setContent({ ...content, image: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keyword.trim()) {
      e.preventDefault();
      if (!content.keywords.includes(keyword.trim())) {
        setContent({
          ...content,
          keywords: [...content.keywords, keyword.trim()]
        });
      }
      setKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setContent({
      ...content,
      keywords: content.keywords.filter(k => k !== keywordToRemove)
    });
  };

  const handleAddTimelineEvent = () => {
    if (timelineEvent.title && timelineEvent.description && timelineEvent.timestamp) {
      const newEvent: TimelineEvent = {
        id: Date.now().toString(),
        title: timelineEvent.title,
        description: timelineEvent.description,
        timestamp: new Date(timelineEvent.timestamp),
        type: timelineEvent.type || 'update',
        image: timelineEvent.image || '',
        source: timelineEvent.source || content.source
      };

      setContent({
        ...content,
        timelineEvents: [...content.timelineEvents, newEvent].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        )
      });

      setTimelineEvent({ type: 'update' });
      setShowTimelineForm(false);
    }
  };

  const removeTimelineEvent = (id: string) => {
    setContent({
      ...content,
      timelineEvents: content.timelineEvents.filter(event => event.id !== id)
    });
  };

  // Function to render the appropriate embed
  const renderEmbed = () => {
    if (!content.iframeUrl) return null;

    if (content.embedType === 'twitter') {
      return (
        <div>
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.embedOptions.hideThread}
                  onChange={e => setContent(prev => ({
                    ...prev,
                    embedOptions: {
                      ...prev.embedOptions,
                      hideThread: e.target.checked
                    }
                  }))}
                  className="form-checkbox"
                />
                Hide conversation thread
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.embedOptions.hideMedia}
                  onChange={e => setContent(prev => ({
                    ...prev,
                    embedOptions: {
                      ...prev.embedOptions,
                      hideMedia: e.target.checked
                    }
                  }))}
                  className="form-checkbox"
                />
                Hide media
              </label>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                Theme:
                <select
                  value={content.embedOptions.theme}
                  onChange={e => setContent(prev => ({
                    ...prev,
                    embedOptions: {
                      ...prev.embedOptions,
                      theme: e.target.value as 'light' | 'dark'
                    }
                  }))}
                  className="bg-matrix-dark border border-matrix-green/30 rounded p-1"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                Alignment:
                <select
                  value={content.embedOptions.align}
                  onChange={e => setContent(prev => ({
                    ...prev,
                    embedOptions: {
                      ...prev.embedOptions,
                      align: e.target.value as 'left' | 'center' | 'right'
                    }
                  }))}
                  className="bg-matrix-dark border border-matrix-green/30 rounded p-1"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </label>
            </div>
          </div>
          <div ref={tweetContainerRef} className="flex justify-center" />
        </div>
      );
    }

    return (
      <iframe
        src={content.iframeUrl}
        className="w-full h-full min-h-[400px]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Content Studio</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={content.title}
              onChange={e => setContent({ ...content, title: e.target.value })}
              className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={content.description}
              onChange={e => setContent({ ...content, description: e.target.value })}
              className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
              rows={4}
              placeholder="Enter article description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Source</label>
            <input
              type="text"
              value={content.source}
              onChange={e => setContent({ ...content, source: e.target.value })}
              className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
              placeholder="Enter content source"
              required
            />
          </div>

          <div className="border border-matrix-green/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Timeline Events</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-matrix-dark/40 rounded-lg p-1">
                  {(['week', 'month', 'year'] as const).map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setTimelineView(view)}
                      className={`px-3 py-1 rounded ${
                        timelineView === view
                          ? 'bg-matrix-green text-matrix-black'
                          : 'text-matrix-green hover:bg-matrix-green/20'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const { start } = getDateRange();
                      setSelectedDate(new Date(start.setDate(start.getDate() - 1)));
                    }}
                    className="p-2 hover:text-matrix-light"
                  >
                    ←
                  </button>
                  <span className="text-sm">
                    {format(selectedDate, 
                      timelineView === 'week' ? "'Week of' MMM d, yyyy" :
                      timelineView === 'month' ? 'MMMM yyyy' :
                      'yyyy'
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const { end } = getDateRange();
                      setSelectedDate(new Date(end.setDate(end.getDate() + 1)));
                    }}
                    className="p-2 hover:text-matrix-light"
                  >
                    →
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTimelineForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30"
                >
                  <FaPlus /> Add Event
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              {getFilteredEvents().length === 0 ? (
                <div className="text-center text-matrix-green/60 py-8">
                  No events in this {timelineView}
                </div>
              ) : (
                getFilteredEvents().map(event => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border border-matrix-green/30 rounded-lg bg-matrix-dark/40"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.type === 'announcement' ? 'bg-blue-500/20 text-blue-400' :
                          event.type === 'development' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {event.type.toUpperCase()}
                        </span>
                        <span className="text-matrix-green/60">
                          {format(event.timestamp, 'PPp')}
                        </span>
                      </div>
                      <h3 className="font-bold mb-1">{event.title}</h3>
                      <p className="text-sm text-matrix-green/80">{event.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTimelineEvent(event.id)}
                      className="text-matrix-green/60 hover:text-matrix-light"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              )}
            </div>

            {showTimelineForm && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                <div className="bg-matrix-dark border border-matrix-green/30 rounded-lg p-6 max-w-lg w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add Timeline Event</h3>
                    <button
                      type="button"
                      onClick={() => setShowTimelineForm(false)}
                      className="text-matrix-green hover:text-matrix-light"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Event Title</label>
                      <input
                        type="text"
                        value={timelineEvent.title || ''}
                        onChange={e => setTimelineEvent({ ...timelineEvent, title: e.target.value })}
                        className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Description</label>
                      <textarea
                        value={timelineEvent.description || ''}
                        onChange={e => setTimelineEvent({ ...timelineEvent, description: e.target.value })}
                        className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Timestamp</label>
                      <input
                        type="datetime-local"
                        value={timelineEvent.timestamp ? format(new Date(timelineEvent.timestamp), "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={e => setTimelineEvent({ ...timelineEvent, timestamp: new Date(e.target.value) })}
                        className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Event Type</label>
                      <select
                        value={timelineEvent.type}
                        onChange={e => setTimelineEvent({ ...timelineEvent, type: e.target.value as TimelineEvent['type'] })}
                        className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                      >
                        <option value="update">Update</option>
                        <option value="announcement">Announcement</option>
                        <option value="development">Development</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowTimelineForm(false)}
                        className="px-4 py-2 text-matrix-green hover:text-matrix-light"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddTimelineEvent}
                        className="px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light"
                      >
                        Add Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Embed Content</label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={content.iframeUrl}
                  onChange={e => handleUrlChange(e.target.value)}
                  className="flex-1 bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
                  placeholder="Enter URL to embed (Twitter or other)"
                />
                <button
                  type="button"
                  onClick={handleIframePreview}
                  className="px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30 flex items-center gap-2"
                >
                  <FaCode />
                  Preview
                </button>
              </div>
              
              {showIframePreview && content.iframeUrl && (
                <div className="border border-matrix-green/30 rounded-lg overflow-hidden">
                  <div className="bg-matrix-dark p-2 text-sm flex justify-between items-center">
                    <span>Preview</span>
                    <button
                      type="button"
                      onClick={() => setShowIframePreview(false)}
                      className="text-matrix-green hover:text-matrix-light"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="bg-matrix-dark p-4">
                    {renderEmbed()}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Image</label>
            <div className="border-2 border-dashed border-matrix-green/30 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                required
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FaImage className="text-4xl mb-2" />
                <span>Click to upload image</span>
              </label>
              
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Keywords</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {content.keywords.map(kw => (
                <span
                  key={kw}
                  className="bg-matrix-green/20 text-matrix-green px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <FaTag className="text-xs" />
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="hover:text-matrix-light"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={addKeyword}
              className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green"
              placeholder="Type keyword and press Enter"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="trending"
              checked={content.trending}
              onChange={e => setContent({ ...content, trending: e.target.checked })}
              className="w-4 h-4 bg-matrix-dark border-matrix-green/30 rounded focus:ring-matrix-green"
            />
            <label htmlFor="trending" className="text-sm font-bold">
              Mark as trending
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-matrix-green text-matrix-black font-bold py-3 px-6 rounded hover:bg-matrix-light transition-colors"
          >
            Publish Content
          </button>
        </form>
      </div>
    </div>
  );
}