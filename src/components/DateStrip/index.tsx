import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { toDateStr } from '@/utils/date';
import { styles, ITEM_WIDTH } from './styles';

const INITIAL_DAYS = 10;
const MORE_DAYS_BATCH = 7;
const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS_SHORT = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
];

export interface DotData {
  taken: number;
  total: number;
}

interface DateStripProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  dotMap?: Record<string, DotData>;
  onLoadMoreDays?: (fromDate: string) => void;
  maxDays?: number;
}

function generateDays(count: number): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(toDateStr(d));
  }
  return days;
}

export function DateStrip({
  selectedDate,
  onSelect,
  dotMap = {},
  onLoadMoreDays,
  maxDays,
}: DateStripProps) {
  const scrollRef = useRef<ScrollView>(null);
  const today = toDateStr(new Date());
  const [daysToShow, setDaysToShow] = useState(INITIAL_DAYS);
  const scrollX = useRef(0);
  const prevContentWidth = useRef(0);
  const pendingExpand = useRef(false);
  const onLoadMoreRef = useRef(onLoadMoreDays);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMoreDays;
  }, [onLoadMoreDays]);

  const effectiveDays = maxDays !== undefined ? Math.min(daysToShow, maxDays) : daysToShow;
  const days = useMemo(() => generateDays(effectiveDays), [effectiveDays]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, []);

  // When daysToShow increases, notify parent to load more data
  useEffect(() => {
    if (daysToShow > INITIAL_DAYS) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - daysToShow + 1);
      onLoadMoreRef.current?.(toDateStr(fromDate));
    }
  }, [daysToShow]);

  const canLoadMore = maxDays === undefined || effectiveDays < maxDays;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = e.nativeEvent.contentOffset.x;

    if (scrollX.current < ITEM_WIDTH && !pendingExpand.current && canLoadMore) {
      pendingExpand.current = true;
      setDaysToShow((prev) => {
        const next = prev + MORE_DAYS_BATCH;
        return maxDays !== undefined ? Math.min(next, maxDays) : next;
      });
    }
  };

  // After prepending days the content shifts right — correct scroll position
  const handleContentSizeChange = (width: number) => {
    if (prevContentWidth.current > 0 && width > prevContentWidth.current) {
      const diff = width - prevContentWidth.current;
      scrollRef.current?.scrollTo({ x: scrollX.current + diff, animated: false });
      pendingExpand.current = false;
    }
    prevContentWidth.current = width;
  };

  const renderDots = (date: string, isSelected: boolean) => {
    const data = dotMap[date];
    if (!data || data.total === 0) return <View style={styles.dots} />;

    const { taken, total } = data;
    const missed = Math.max(0, total - taken);
    const maxDots = 4;
    const displayTaken = Math.min(taken, maxDots);
    const displayMissed = Math.min(missed, maxDots - displayTaken);

    return (
      <View style={styles.dots}>
        {Array.from({ length: displayTaken }).map((_, i) => (
          <View
            key={`t${i}`}
            style={[styles.dot, isSelected ? styles.dotTakenSelected : styles.dotTaken]}
          />
        ))}
        {Array.from({ length: displayMissed }).map((_, i) => (
          <View
            key={`m${i}`}
            style={[styles.dot, isSelected ? styles.dotMissedSelected : styles.dotMissed]}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      onScroll={handleScroll}
      scrollEventThrottle={150}
      onContentSizeChange={handleContentSizeChange}
    >
      {days.map((date) => {
        const d = new Date(date + 'T12:00:00');
        const isToday = date === today;
        const isSelected = date === selectedDate;
        const hasRecords = Boolean(dotMap[date]);
        const isDisabled = !hasRecords && !isSelected;
        const dayNum = d.getDate();
        const monthStr = MONTHS_SHORT[d.getMonth()];
        const weekday = isToday ? 'Hoje' : WEEKDAYS_SHORT[d.getDay()];

        return (
          <TouchableOpacity
            key={date}
            style={[
              styles.item,
              hasRecords && !isSelected && styles.itemEnabled,
              isDisabled && styles.itemDisabled,
              isSelected && styles.itemSelected,
            ]}
            onPress={() => onSelect(date)}
            activeOpacity={0.7}
          >
            <Text style={[styles.weekday, isSelected && styles.textSelected]}>{weekday}</Text>
            <Text style={[styles.day, isSelected && styles.textSelected]}>{dayNum}</Text>
            <Text style={[styles.month, isSelected && styles.textSelected]}>{monthStr}</Text>
            {renderDots(date, isSelected)}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
