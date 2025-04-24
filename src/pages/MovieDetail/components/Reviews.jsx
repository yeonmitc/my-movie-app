import React, { useState } from 'react';
import './Reviews.style.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import Star from '@/common/components/Star';

const Review = ({ author, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 500;
  const isLong = content.length > MAX_LENGTH;
  const displayedContent = isExpanded ? content : content.slice(0, MAX_LENGTH);

  // 🛡️ XSS 방지: sanitize content
  const safeContent = DOMPurify.sanitize(displayedContent);

  return (
    <div className="review-card">
      <div className="review-author">✍️ {author}</div>

      {/* ✅ 별점이 존재할 경우 렌더링 */}
      {typeof rating === 'number' && (
        <div className="review-rating mb-2 flex items-center gap-2">
          <Star w="w-5" h="h-5" readonly={true} rate={rating} />
          <span className="text-sm font-medium text-[var(--color-text-2)]">
            {rating.toFixed(1)}
          </span>
        </div>
      )}

      <p className="review-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{safeContent}</ReactMarkdown>
        {isLong && (
          <button className="btn review-toggle" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </p>
    </div>
  );
};

const Reviews = ({ reviews }) => {
  return reviews && reviews.length > 0 ? (
    reviews.map((review) => (
      <Review
        key={review.id}
        author={review.author}
        content={review.content}
        rating={review.author_details?.rating}
      />
    ))
  ) : (
    <div className="review-card">
      <p className="no-review-msg">해당 영화는 리뷰가 없습니다.</p>
    </div>
  );
};

export default Reviews;
