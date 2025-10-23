import React from 'react';
import { PinStats } from '../../types/pinterest';
import { formatNumberWithCommas, formatDateTime } from '../../utils/formatters';
import * as S from './statsTable.styles';

interface StatsTableRowProps {
  pin: PinStats;
}

export function StatsTableRow({ pin }: StatsTableRowProps) {
  return (
    <S.TableRow>
      <S.TableCell>
        {pin.imageUrl && <S.Thumbnail src={pin.imageUrl} alt={pin.title} />}
      </S.TableCell>
      <S.TableCell>
        <S.TitleCell>{pin.title}</S.TitleCell>
      </S.TableCell>
      <S.TableCell>{formatNumberWithCommas(pin.saves)}</S.TableCell>
      <S.TableCell>{formatNumberWithCommas(pin.likes)}</S.TableCell>
      <S.TableCell>{formatNumberWithCommas(pin.comments)}</S.TableCell>
      <S.TableCell>{formatDateTime(pin.createdAt)}</S.TableCell>
      <S.TableCell>
        <S.Link href={pin.url} target="_blank" rel="noopener noreferrer">
          View Pin
        </S.Link>
      </S.TableCell>
    </S.TableRow>
  );
}
