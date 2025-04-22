import React, { useEffect } from 'react';
import YouTube from 'react-youtube';
import toast from 'react-hot-toast';
import { useVideoModalStore } from '@/store/videoModalStore';
import { useMovieVideosQuery } from '@/hooks/useMovieVideos';
import { IoClose } from 'react-icons/io5';

const VideoModal = () => {
  const { isOpen, videoId: movieId, closeModal } = useVideoModalStore();
  const { data: videos, isLoading, isError, error } = useMovieVideosQuery(movieId);

  const youtubeVideo = videos?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  // ✅ 예고편 없을 때 토스트
  useEffect(() => {
    if (!isLoading && isOpen && videos && videos.length === 0) {
      toast.error('이 영화는 예고편이 없습니다.',{
        id: 'video-error', 
      });
    }
  }, [videos, isLoading, isOpen]);

  // 기존 에러 처리
  if (isError && error?.message) {
    toast.error(`예고편 불러오기 실패: ${error.message}`);
    return null;
  }

  if (!isOpen || (!youtubeVideo && !isLoading)) return null;

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeModal}
    >
      <div
        className="relative aspect-video w-[90vw] max-w-[960px] overflow-hidden rounded-xl border border-white bg-[var(--color-bg-1)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 z-10 text-3xl text-white"
          aria-label="닫기"
        >
          <IoClose />
        </button>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="loading-spinner" />
          </div>
        ) : (
          <YouTube videoId={youtubeVideo.key} opts={opts} className="h-full w-full" />
        )}
      </div>
    </div>
  );
};

export default VideoModal;