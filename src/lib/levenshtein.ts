/**
 * Алгоритм расстояния Левенштейна для нечеткого поиска
 * Возвращает "расстояние" между двумя строками (число изменений для превращения одной строки в другую)
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Инициализируем матрицу
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Заполняем матрицу
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // замена
          matrix[i][j - 1] + 1, // вставка
          matrix[i - 1][j] + 1, // удаление
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Функция для нечеткого поиска с использованием алгоритма Левенштейна
 * Возвращает true, если строка searchString похожа на targetString с максимальным расстоянием maxDistance
 */
export function fuzzySearch(searchString: string, targetString: string, maxDistance = 2): boolean {
  if (!searchString) return true;

  searchString = searchString.toLowerCase();
  targetString = targetString.toLowerCase();

  // Проверяем прямое включение
  if (targetString.includes(searchString)) return true;

  // Если строка поиска больше целевой строки более чем на maxDistance, то они слишком разные
  if (searchString.length > targetString.length + maxDistance) return false;

  // Разбиваем строку поиска на слова
  const searchWords = searchString.split(/\s+/);
  const targetWords = targetString.split(/\s+/);

  // Для каждого слова в поисковой строке проверяем, есть ли похожее слово в целевой строке
  for (const word of searchWords) {
    if (word.length <= 2) {
      // Игнорируем короткие слова
      continue;
    }

    let foundMatch = false;

    for (const targetWord of targetWords) {
      if (targetWord.length <= 2) {
        // Игнорируем короткие слова
        continue;
      }

      const distance = levenshteinDistance(word, targetWord);
      const maximumAllowedDistance = Math.floor(Math.max(word.length, targetWord.length) / 3);
      const thresholdDistance = Math.min(maxDistance, maximumAllowedDistance);

      if (distance <= thresholdDistance) {
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
      return false;
    }
  }

  return true;
}
