export interface Term {
  id: string;
  /** Исходная фраза в RU-тексте */
  source: string;
  /** Варианты EN-термина в переводе */
  translations: string[];
  /** Активный EN-вариант в тексте перевода */
  selectedTranslation: string;
  description?: string;
  /** Позиция в EN-переводе */
  start: number;
  end: number;
}
