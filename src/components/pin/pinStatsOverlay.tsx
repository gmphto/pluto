import React from 'react';
import { PinStats } from '../../types/pinterest';
import { formatNumber, formatDate } from '../../utils/formatters';
import * as S from './pinStatsOverlay.styles';

interface PinStatsOverlayProps {
  stats: PinStats;
}

export function PinStatsOverlay({ stats }: PinStatsOverlayProps) {
  return (
    <S.Container>
      <S.StatsRow>
        <S.Stat>
          <S.Icon>📌</S.Icon>
          <S.Value>{formatNumber(stats.saves)}</S.Value>
          <S.Label>saves</S.Label>
        </S.Stat>

        <S.Stat>
          <S.Icon>❤️</S.Icon>
          <S.Value>{formatNumber(stats.likes)}</S.Value>
          <S.Label>likes</S.Label>
        </S.Stat>

        <S.Stat>
          <S.Icon>💬</S.Icon>
          <S.Value>{formatNumber(stats.comments)}</S.Value>
          <S.Label>comments</S.Label>
        </S.Stat>
      </S.StatsRow>

      <S.DateInfo>📅 {formatDate(stats.createdAt)}</S.DateInfo>
    </S.Container>
  );
}
