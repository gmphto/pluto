import React from 'react';
import * as S from './floatingButton.styles';

interface FloatingButtonProps {
  onClick: () => void;
  pinCount: number;
}

export function FloatingButton({ onClick, pinCount }: FloatingButtonProps) {
  return (
    <S.Button onClick={onClick}>
      <S.Icon>📊</S.Icon>
      <S.Text>Open Pin Stats Table</S.Text>
      {pinCount > 0 && <S.Badge>{pinCount}</S.Badge>}
    </S.Button>
  );
}
