const changeLocale = (value: string | number, locale: 'fa' | 'en') => {
  const inputValue = typeof value === 'number' ? value.toString() : value;
  const letters = [
    { persian: '۰', english: '0' },
    { persian: '۱', english: '1' },
    { persian: '۲', english: '2' },
    { persian: '۳', english: '3' },
    { persian: '۴', english: '4' },
    { persian: '۵', english: '5' },
    { persian: '۶', english: '6' },
    { persian: '۷', english: '7' },
    { persian: '۸', english: '8' },
    { persian: '۹', english: '9' },
  ];
  return inputValue
    .split('')
    .map((inputLetter) => {
      const outputLetter = letters.find(
        (letter) =>
          inputLetter === letter.persian || inputLetter === letter.english
      );
      if (!outputLetter) return inputLetter;
      if (locale === 'fa') return outputLetter.persian;
      if (locale === 'en') return outputLetter.english;
      return inputLetter;
    })
    .join('');
};

export default changeLocale;
