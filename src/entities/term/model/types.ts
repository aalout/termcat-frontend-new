export interface Term {
  id: string;
  /** Канонический RU-термин — заголовок карточки */
  source: string;
  /** Спорные RU-варианты перевода */
  translations: string[];
  /** Активный вариант в тексте перевода */
  selectedTranslation: string;
  description?: string;
  /** Позиция в RU-переводе */
  start: number;
  end: number;
}
