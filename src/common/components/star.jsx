import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';

export default function Star({ w, h, readonly, rate = 0 }) {
  // ⭐ 10점 → 5점 변환은 렌더링 시 직접 처리
  const actualRating = readonly ? rate / 2 : undefined;
  const [rating, setRating] = useState(actualRating || 0);

  const handleClickStar = (index) => {
    if (!readonly) {
      setRating(index + 1);
    }
  };

  const calculateRate = (rate, index) => {
    if (rate >= index) return '100%';
    if (Math.floor(index - rate) > 0) return '0%';
    const percentage = ((rate % 1) * 100).toFixed();
    return `${percentage}%`;
  };

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => {
        const current = readonly ? actualRating : rating;

        return (
          <div
            key={index}
            className={`relative ${w} ${h} cursor-pointer`}
            onClick={() => handleClickStar(index)}
          >
            <FaStar
              className={`${w} ${h} ${!readonly && current >= index + 1 ? 'text-yellow-400' : 'text-gray-300'}`}
            />
            {readonly && (
              <span
                style={{ width: calculateRate(current, index + 1) }}
                className={`${h} absolute top-0 left-0 overflow-hidden`}
              >
                <FaStar className="h-full w-auto text-yellow-400" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
