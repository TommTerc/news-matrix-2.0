import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaComment, FaShare, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import { format, formatDistanceToNow, isSameMonth } from 'date-fns';
import { mockNews, timelineEvents, TimelineEvent } from '../data/mockData';
import Comment from '../components/Comment';
import RelatedVideos from '../components/RelatedVideos';

export default function NewsDetail() {
  const { id } = useParams();
  const newsItem = mockNews.find(item => item.id === id);
  const events = timelineEvents[id || ''] || [];
  const [selectedDate, setSelectedDate] = useState<Date>(
    events.length > 0 ? events[0].timestamp : new Date()
  );
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-matrix-black text-matrix-green flex items-center justify-center">
        News item not found
      </div>
    );
  }

  // Get unique months from events
  const months = Array.from(
    new Set(
      events.map(event => format(event.timestamp, 'yyyy-MM'))
    )
  ).sort();

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = format(event.timestamp, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green p-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-matrix-green hover:text-matrix-light mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Feed
        </Link>

        {/* Main Article */}
        <article className="border border-matrix-green/30 rounded-lg p-6 bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 mb-12 hover:shadow-lg hover:shadow-matrix-green/20 transition-all">
          <img 
            src={newsItem.image} 
            alt={newsItem.title}
            className="w-full h-96 object-cover rounded-lg mb-6 border border-matrix-green/30"
          />
          
          <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
          
          <div className="flex items-center text-matrix-green/70 mb-6">
            <span>{newsItem.source}</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(newsItem.timestamp)} ago</span>
          </div>

          <p className="text-lg mb-6">{newsItem.description}</p>

          <div className="flex items-center space-x-12 text-matrix-green/60 border-t border-matrix-green/30 pt-4">
            <button className="flex items-center space-x-2 hover:text-matrix-light transition-colors group">
              <FaHeart className="group-hover:scale-110 transition-transform" />
              <span>{newsItem.likes}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-matrix-light transition-colors group">
              <FaComment className="group-hover:scale-110 transition-transform" />
              <span>{newsItem.comments}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-matrix-light transition-colors group">
              <FaShare className="group-hover:scale-110 transition-transform" />
              <span>{newsItem.shares}</span>
            </button>
          </div>
        </article>

        {/* Related Videos */}
        <div className="mb-8">
          <RelatedVideos />
        </div>

        {/* Timeline Section */}
        <section className="mb-12 overflow-hidden">
          <div className="relative">
            {/* Timeline Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-matrix-green matrix-text">Sacred Timeline</h2>
              <span className="text-matrix-green/60">
                {format(selectedDate, 'MMMM yyyy')}
              </span>
            </div>

            {/* Timeline Months */}
            <div className="flex border-b border-matrix-green/30 relative mb-8">
              {months.map((month, index) => (
                <div
                  key={month}
                  className="flex-1 relative pb-8"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0,
                    animation: 'timelineFlow 0.8s ease-out forwards'
                  }}
                >
                  {/* Month Label */}
                  <div className="absolute bottom-full mb-2 font-bold timeline-content">
                    {format(new Date(month), 'MMMM yyyy')}
                  </div>
                  
                  {/* Timeline Points */}
                  <div className="absolute bottom-0 left-0 w-full flex items-center justify-start">
                    {events
                      .filter(event => format(event.timestamp, 'yyyy-MM') === month)
                      .map((event, eventIndex) => (
                        <div
                          key={event.id}
                          className="timeline-dot w-4 h-4 rounded-full border-2 transition-all transform hover:scale-125"
                          style={{
                            left: `${(new Date(event.timestamp).getDate() - 1) * (100 / 31)}%`,
                            animationDelay: `${index * 0.2 + eventIndex * 0.1}s`,
                            borderColor: isSameMonth(event.timestamp, selectedDate) 
                              ? '#00ff00' 
                              : 'rgba(0, 255, 0, 0.3)',
                            backgroundColor: isSameMonth(event.timestamp, selectedDate)
                              ? '#00ff00'
                              : 'transparent'
                          }}
                        >
                          <div className="absolute bottom-full mb-2 text-xs text-matrix-green/60 whitespace-nowrap transform -translate-x-1/2 left-1/2 timeline-content">
                            {format(event.timestamp, 'h:mm a')}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Connecting Line */}
                  <div 
                    className="timeline-line absolute bottom-2 left-0 w-full"
                    style={{ animationDelay: `${index * 0.3}s` }}
                  />
                </div>
              ))}
            </div>

            {/* News Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(eventsByDate)
                .filter(([date]) => isSameMonth(new Date(date), selectedDate))
                .map(([date, dayEvents], groupIndex) => (
                  <div 
                    key={date} 
                    className="timeline-event border border-matrix-green/30 rounded-lg overflow-hidden bg-matrix-dark/20"
                    style={{ animationDelay: `${groupIndex * 0.2}s` }}
                  >
                    <div className="text-lg font-bold p-4 border-b border-matrix-green/30">
                      {format(new Date(date), 'MMMM d, yyyy')}
                    </div>
                    <div className="p-4 space-y-4">
                      {dayEvents.map((event, eventIndex) => (
                        <div 
                          key={event.id} 
                          className="timeline-content border border-matrix-green/30 rounded-lg p-4 bg-matrix-dark/40"
                          style={{ animationDelay: `${groupIndex * 0.2 + eventIndex * 0.1}s` }}
                        >
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-lg mb-4 border border-matrix-green/30"
                          />
                          <div className="mb-2">
                            <div className="flex justify-between items-center text-sm text-matrix-green/60 mb-2">
                              <span>{event.source}</span>
                              <span>{format(event.timestamp, 'h:mm a')}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                          </div>
                          <p className="text-matrix-green/80 text-sm mb-4">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="bg-matrix-dark border border-matrix-green/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-matrix-dark border-b border-matrix-green/30 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-matrix-green hover:text-matrix-light"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg mb-6 border border-matrix-green/30"
                />
                
                <div className="flex justify-between items-center mb-4 text-matrix-green/60">
                  <span>{selectedEvent.source}</span>
                  <span>{format(selectedEvent.timestamp, 'PPpp')}</span>
                </div>
                
                <p className="text-matrix-green mb-8">{selectedEvent.description}</p>
                
                {/* Comments Section */}
                <div className="border-t border-matrix-green/30 pt-6">
                  <h3 className="text-xl font-bold mb-6">Comments</h3>
                  <div className="space-y-6">
                    {selectedEvent.comments?.map((comment) => (
                      <Comment key={comment.id} comment={comment} />
                    ))}
                  </div>
                  
                  {/* Add Comment Form */}
                  <form className="mt-8">
                    <textarea
                      className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green focus:outline-none focus:border-matrix-green"
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light"
                      >
                        Comment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}