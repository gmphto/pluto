import React from 'react';
import * as S from './statsHeader.styles';

interface StatsHeaderProps {
  totalPins: number;
  filteredPins: number;
}

export function StatsHeader({ totalPins, filteredPins }: StatsHeaderProps) {
  return (
    <S.Header>
      <S.Title>📊 Pinterest Pin Stats Table</S.Title>
      <S.Subtitle>
        Analyzing {filteredPins} of {totalPins} pins
      </S.Subtitle>
    </S.Header>
  );
}
