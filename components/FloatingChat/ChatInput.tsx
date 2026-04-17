"use client";
import React, { useCallback } from 'react';
import { SendFill } from 'react-bootstrap-icons';

interface Props {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSendMessage: () => void;
}

function ChatInput({ inputValue, setInputValue, onSendMessage }: Props) {
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      onSendMessage();
    }
  }, [onSendMessage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, [setInputValue]);

  return (
    <div className="p-3 bg-white border-top">
      <div className="input-group shadow-sm">
        <input 
          type="text" 
          className="form-control border-primary" 
          placeholder="메시지 입력..." 
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary px-3" onClick={onSendMessage}>
          <SendFill style={{ width: 'var(--icon-size-base)', height: 'var(--icon-size-base)' }} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(ChatInput);