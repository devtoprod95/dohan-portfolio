"use client";
import React, { useCallback, useRef } from 'react';

interface Props {
  messages: any[];
  myNickname: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onLoadMore: () => void;
  loadingMore: boolean;
  hasMore: boolean; // ✅ 부모로부터 데이터가 더 있는지 여부를 직접 받음
}

function ChatBody({ messages, myNickname, scrollRef, onLoadMore, loadingMore, hasMore }: Props) {
  const throttleRef = useRef(false);

  // [스크롤 핸들러]
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // 1. 이미 로딩 중이거나 2. 더 가져올 데이터가 없거나(hasMore: false) 3. 쓰로틀링 중이면 리턴
    if (loadingMore || !hasMore || throttleRef.current) return;

    const scrollTop = e.currentTarget.scrollTop;

    // 최상단 도달 시 추가 데이터 로드 요청
    if (scrollTop <= 15) {
      throttleRef.current = true;
      onLoadMore();
      setTimeout(() => { throttleRef.current = false; }, 500);
    }
  }, [loadingMore, onLoadMore, hasMore]);

  return (
    <div className="flex-grow-1 overflow-hidden bg-light" style={{ height: '100%' }}>
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="h-100 overflow-auto p-3"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y', // ✅ 세로 스크롤만 명시적으로 허용,
          overscrollBehavior: 'contain' // ✅ 여기에 추가 (부모로 전파 차단)
        }}
      >
        {/* ✅ 최상단: 더 이상 데이터가 없을 때만 보여주는 정적 안내 띠 */}
        {!hasMore && messages.length > 0 && (
          <div className="text-center mb-4 mt-2">
            <div 
              className="d-inline-block py-1 px-3 rounded-pill" 
              style={{ backgroundColor: '#f1f3f5', color: '#adb5bd', fontSize: '11px' }}
            >
              ✨ 대화의 시작점입니다
            </div>
            <hr style={{ borderTop: '1px solid #dee2e6', margin: '20px 0 -10px 0', opacity: 0.3 }} />
          </div>
        )}

        {/* 로딩 표시: 데이터를 가져오는 중일 때만 상단에 표시 */}
        {loadingMore && (
          <div className="text-center py-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <React.Fragment key={msg.id}>
            {/* 날짜 배지: 이전 메시지와 날짜가 다를 때만 렌더링 */}
            {(idx === 0 || messages[idx - 1].date !== msg.date) && (
              <div className="text-center my-3">
                <span className="badge bg-secondary-subtle text-dark fw-normal" style={{ fontSize: '11px' }}>
                  {msg.date}
                </span>
              </div>
            )}

            {/* 메시지 말풍선 */}
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