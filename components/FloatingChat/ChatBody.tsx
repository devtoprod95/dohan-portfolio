"use client";
import React, { useCallback, useRef, useState, useEffect } from 'react';

interface Props {
  messages: any[];
  myNickname: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onLoadMore: () => void;
  loadingMore: boolean;
}

function ChatBody({ messages, myNickname, scrollRef, onLoadMore, loadingMore }: Props) {
  const throttleRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const prevMsgsCount = useRef(messages.length);

  // 데이터 소진 감지
  useEffect(() => {
    if (!loadingMore && prevMsgsCount.current !== 0 && prevMsgsCount.current === messages.length) {
      setHasMore(false);
    }
    prevMsgsCount.current = messages.length;
  }, [loadingMore, messages.length]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (throttleRef.current || loadingMore || !hasMore) return;

    const scrollTop = e.currentTarget.scrollTop;

    // 최상단 도달 시 추가 데이터 로드 (hasMore가 true일 때만)
    if (scrollTop <= 15) {
      throttleRef.current = true;
      onLoadMore();
      setTimeout(() => { throttleRef.current = false; }, 500);
    }
  }, [loadingMore, onLoadMore, hasMore]);

  return (
    <div 
      className="flex-grow-1 overflow-hidden bg-light"
      style={{ height: '100%' }}
    >
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="h-100 overflow-auto p-3"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* ✅ 1. 더 이상 데이터가 없을 때 최상단에 고정되는 안내 띠 */}
        {!hasMore && messages.length > 0 && (
          <div className="text-center mb-4 mt-2">
            <div 
              className="d-inline-block py-1 px-3 rounded-pill" 
              style={{ backgroundColor: '#e9ecef', color: '#6c757d', fontSize: '11px' }}
            >
              <i className="bi bi-info-circle me-1"></i> 대화의 시작입니다.
            </div>
            <hr style={{ borderTop: '1px solid #dee2e6', margin: '20px 0 -10px 0', opacity: 0.5 }} />
          </div>
        )}

        {/* 로딩 바 (데이터 가져오는 중일 때만 표시) */}
        {loadingMore && (
          <div className="text-center py-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <React.Fragment key={msg.id}>
            {/* 날짜 구분선 */}
            {(idx === 0 || messages[idx - 1].date !== msg.date) && (
              <div className="text-center my-3">
                <span className="badge bg-secondary-subtle text-dark fw-normal" style={{ fontSize: '11px' }}>
                  {msg.date}
                </span>
              </div>
            )}

            {/* 메시지 본문 */}
            <div className={`d-flex flex-column mb-3 ${msg.isMe ? 'align-items-end' : 'align-items-start'}`}>
              <div className="d-flex align-items-center mb-1" style={{ fontSize: '11px' }}>
                {!msg.isMe && <b className="me-2">{msg.sender}</b>}
                <span className="text-muted">{msg.time}</span>
                {msg.isMe && <b className="ms-2">{msg.sender}</b>} 
              </div>
              <div 
                className={`p-2 px-3 shadow-sm ${msg.isMe ? 'bg-primary text-white' : 'bg-white border'}`}
                style={{ 
                  maxWidth: '85%', 
                  fontSize: '13px', 
                  borderRadius: msg.isMe ? '12px 0 12px 12px' : '0 12px 12px 12px' 
                }}
              >
                {msg.text}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ChatBody);