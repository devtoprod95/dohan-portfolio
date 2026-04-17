"use client";
import React, { useState, useCallback } from 'react';
import { ChatQuoteFill, CheckLg, GearFill } from 'react-bootstrap-icons';

interface Props {
  myNickname: string;
  setMyNickname: (name: string) => void;
  onlineCount: number;
  onClose: () => void;
}

function ChatHeader({ myNickname, setMyNickname, onlineCount, onClose }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(myNickname);

  const handleSave = useCallback(() => {
    if (tempName.trim()) {
      setMyNickname(tempName);
      setIsEditing(false);
    }
  }, [tempName, setMyNickname]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') handleSave();
  }, [handleSave]);

  const handleEditStart = useCallback(() => {
    setTempName(myNickname); // ✅ 편집 시작 시 현재 닉네임 동기화
    setIsEditing(true);
  }, [myNickname]);

  return (
    <div className="bg-primary text-white p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 small fw-bold d-flex align-items-center">
          <ChatQuoteFill className="me-2" style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} /> 실시간 커피톡
        </h5>
        <button className="btn-close btn-close-white" onClick={onClose}></button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center bg-white bg-opacity-25 rounded-pill px-2 py-1" style={{ fontSize: '11px' }}>
          <span className="bg-success rounded-circle me-1" style={{ width: '6px', height: '6px' }}></span>
          현재 {onlineCount}명 접속중
        </div>

        <div className="d-flex align-items-center" style={{ height: '31px' }}>
          <span className="me-2 opacity-75" style={{ fontSize: '13px' }}>닉네임:</span>
          {isEditing ? (
            <div className="input-group input-group-sm" style={{ width: '130px' }}>
              <input 
                className="form-control form-control-sm border-0 shadow-none py-0" 
                style={{ height: '24px', fontSize: '12px' }}
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
              />
              <button className="btn btn-light btn-sm py-0 px-2" onClick={handleSave}>
                <CheckLg style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} />
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleEditStart}>
              <span className="fw-bold border-bottom border-white border-opacity-50" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                {myNickname}
              </span>
              <GearFill className="ms-2 opacity-75" style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatHeader);