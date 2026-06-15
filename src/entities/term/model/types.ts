export interface Term {
  id: string;
  /** EN-фраза в исходнике */
  phrase: string;
  /** Канонический RU-перевод — заголовок карточки */
  source: string;
  /** Спорные RU-варианты перевода */
  translations: string[];
  /** Выбранный RU-вариант в тексте */
  selectedTranslation: string;
  description?: string;
  /** Позиция EN-фразы в исходном тексте */
  sourceStart: number;
  sourceEnd: number;
  /** Позиция RU-термина в результирующем тексте */
  start: number;
  end: number;
}
