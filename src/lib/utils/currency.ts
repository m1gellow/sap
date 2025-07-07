// Утилиты для работы с валютами и форматирования цен

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // курс к базовой валюте (рубль)
  locale: string;
}

// Конфигурация валют
export const CURRENCIES: Record<string, CurrencyConfig> = {
  RUB: {
    code: 'RUB',
    symbol: '₽',
    rate: 1,
    locale: 'ru-RU',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 0.011, // примерный курс 1 рубль = 0.011 доллара
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.010, // примерный курс 1 рубль = 0.010 евро
    locale: 'de-DE',
  },
};

// Конвертация цены из рублей в выбранную валюту
export const convertPrice = (priceInRubles: number, targetCurrency: string): number => {
  const currency = CURRENCIES[targetCurrency];
  if (!currency) {
    console.warn(`Валюта ${targetCurrency} не поддерживается, используется RUB`);
    return priceInRubles;
  }
  
  return Math.round(priceInRubles * currency.rate * 100) / 100;
};

// Форматирование цены с учетом валюты
export const formatPrice = (priceInRubles: number, targetCurrency: string = 'RUB'): string => {
  const currency = CURRENCIES[targetCurrency] || CURRENCIES.RUB;
  const convertedPrice = convertPrice(priceInRubles, targetCurrency);
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: targetCurrency === 'RUB' ? 0 : 2,
    maximumFractionDigits: targetCurrency === 'RUB' ? 0 : 2,
  }).format(convertedPrice);
};

// Форматирование цены без символа валюты
export const formatPriceNumber = (priceInRubles: number, targetCurrency: string = 'RUB'): string => {
  const currency = CURRENCIES[targetCurrency] || CURRENCIES.RUB;
  const convertedPrice = convertPrice(priceInRubles, targetCurrency);
  
  return new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: targetCurrency === 'RUB' ? 0 : 2,
    maximumFractionDigits: targetCurrency === 'RUB' ? 0 : 2,
  }).format(convertedPrice);
};

// Получение символа валюты
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES[currencyCode];
  return currency ? currency.symbol : '₽';
};

// Обновление курсов валют (можно расширить для получения актуальных курсов)
export const updateExchangeRates = async (): Promise<void> => {
  // Здесь можно добавить логику получения актуальных курсов валют
  // Например, через API ЦБ РФ или другие сервисы
  console.log('Обновление курсов валют...');
  
  // Пример обновления курсов (в реальном приложении данные получаются с API)
  try {
    // Здесь был бы запрос к API курсов валют
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
    // const data = await response.json();
    
    // Обновляем курсы в объекте CURRENCIES
    // CURRENCIES.USD.rate = data.rates.USD;
    // CURRENCIES.EUR.rate = data.rates.EUR;
    
    console.log('Курсы валют обновлены');
  } catch (error) {
    console.error('Ошибка при обновлении курсов валют:', error);
  }
};