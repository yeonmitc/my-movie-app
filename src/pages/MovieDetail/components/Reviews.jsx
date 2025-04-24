import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Reviews.style.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import Star from '@/common/components/Star';
import { useParams } from 'react-router-dom';
import { useMovieReviewsInfiniteQuery } from '@/hooks/useMovieReviewsInfinite';
import toast from 'react-hot-toast';
import CustomToast from '@/common/components/CustomToast';

const Review = ({ author, content, rating }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 500;
  const isLong = content.length > MAX_LENGTH;
  const displayedContent = isExpanded ? content : content.slice(0, MAX_LENGTH);
  const safeContent = DOMPurify.sanitize(displayedContent);

  return (
    <div className="review-card">
      <div className="review-author">✍️ {author}</div>
      {typeof rating === 'number' && (
        <div className="review-rating mb-2 flex items-center gap-2">
          <Star w="w-5" h="h-5" readonly={true} rate={rating} />
          <span className="text-sm font-medium text-[var(--color-text-2)]">
            {rating.toFixed(1)}
          </span>
        </div>
      )}
      <div className="review-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{safeContent}</ReactMarkdown>
        {isLong && (
          <button className="btn review-toggle" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>
    </div>
  );
};

const Reviews = () => {
  const { id } = useParams();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMovieReviewsInfiniteQuery(id);
  const reviews = data?.pages.flatMap((page) => page.results) || [];

  const scrollBoxRef = useRef(null);
  const sentinelRef = useRef(null);

  const showNoMoreReviewsToast = useCallback(() => {
    toast.custom(<CustomToast message="더 이상 리뷰가 없습니다." />, {
      id: 'no-more-reviews',
    });
  }, []);

  useEffect(() => {
    const container = scrollBoxRef.current;
    const sentinel = sentinelRef.current;

    if (!container || !sentinel) return;
    if (reviews.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        //console.log('[DEBUG] entry.isIntersecting:', entry.isIntersecting);
        if (entry.isIntersecting) {
          //  console.log('📍 Intersection detected');
          hasNextPage ? fetchNextPage() : showNoMoreReviewsToast();
        }
      },
      { root: container, threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, reviews]);

  if (reviews.length === 0) {
    return (
      <div className="review-card">
        <p className="no-review-msg">해당 영화는 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div ref={scrollBoxRef} className="review-scroll-box max-h-[600px] overflow-y-auto px-2">
      {reviews.map((review, idx) => (
        <Review
          key={`${review.id}-${idx}`}
          author={review.author}
          content={review.content}
          rating={review.author_details?.rating}
        />
      ))}
      <div ref={sentinelRef} className="h-10 w-full bg-transparent" />
      {isFetchingNextPage && (
        <p className="py-2 text-center text-sm text-gray-400">리뷰 더 불러오는 중...</p>
      )}
    </div>
  );
};

export default Reviews;
