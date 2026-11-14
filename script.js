/**
 * Валидация данных формы и расчёт стоимости туристической путёвки
 * @param {string} name - ФИО клиента
 * @param {string} email - Электронная почта
 * @param {number} tourPrice - Цена выбранного тура за 1 человека
 * @param {number} guests - Количество туристов (от 1 до 20)
 */
function validateAndCalculateBooking(name, email, tourPrice, guests) {
  if (typeof name !== 'string' || typeof email !== 'string') {
    throw new TypeError('Имя и Email должны быть строками');
  }
  if (
    typeof tourPrice !== 'number' ||
    typeof guests !== 'number' ||
    Number.isNaN(tourPrice) ||
    Number.isNaN(guests)
  ) {
    throw new TypeError('Цена и количество гостей должны быть числами');
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Введите корректное имя (минимум 2 символа)' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Некорректный формат Email' };
  }

  if (tourPrice <= 0) {
    return { valid: false, error: 'Выберите направление тура' };
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return { valid: false, error: 'Количество туристов должно быть от 1 до 20' };
  }

  return { valid: true, totalPrice: tourPrice * guests };
}

// Работа с DOM в браузере
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    const tourSelect = document.getElementById('tourSelect');
    const guestsInput = document.getElementById('guestsCount');
    const livePriceValue = document.getElementById('livePriceValue');
    const livePriceFormula = document.getElementById('livePriceFormula');
    const summaryBar = document.querySelector('.live-summary-bar');
    const resultBox = document.getElementById('formResult');

    // Функция динамического пересчёта стоимости до нажатия кнопки
    function updateLivePrice() {
      const price = Number(tourSelect.value);
      const guests = Number(guestsInput.value);

      if (!price || price <= 0) {
        livePriceValue.textContent = '0 ₽';
        livePriceFormula.textContent = 'выберите маршрут';
        livePriceFormula.className = 'text-muted';
        summaryBar.classList.remove('active-calc');
        return;
      }

      if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
        livePriceValue.textContent = '—';
        livePriceFormula.textContent = 'укажите от 1 до 20 человек';
        livePriceFormula.className = 'text-danger fw-semibold';
        summaryBar.classList.remove('active-calc');
        return;
      }

      const total = price * guests;
      livePriceValue.textContent = `${total.toLocaleString('ru-RU')} ₽`;
      livePriceFormula.textContent = `(${price.toLocaleString('ru-RU')} ₽ × ${guests} чел.)`;
      livePriceFormula.className = 'text-muted';
      summaryBar.classList.add('active-calc');
    }

    // Слушатели изменений для мгновенного пересчёта
    tourSelect.addEventListener('change', updateLivePrice);
    guestsInput.addEventListener('input', updateLivePrice);

    // Автовыбор тура в форме при клике на кнопку «Выбрать» в карточках
    const tourCardPrices = {
      'tour-altai': '45000',
      'tour-baikal': '38000',
      'tour-kamchatka': '85000'
    };

    Object.entries(tourCardPrices).forEach(([cardId, priceValue]) => {
      const cardBtn = document.querySelector(`#${cardId} a[href="#bookingSection"]`);
      if (cardBtn) {
        cardBtn.addEventListener('click', () => {
          tourSelect.value = priceValue;
          updateLivePrice();
        });
      }
    });

    // Обработка отправки формы
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value;
      const email = document.getElementById('userEmail').value;
      const price = Number(tourSelect.value);
      const guests = Number(guestsInput.value);

      const res = validateAndCalculateBooking(name, email, price, guests);

      if (res.valid) {
        resultBox.className = 'col-12 text-center fw-bold mt-3 text-success';
        resultBox.textContent = `Заявка успешно оформлена! К оплате: ${res.totalPrice.toLocaleString('ru-RU')} ₽`;
      } else {
        resultBox.className = 'col-12 text-center fw-bold mt-3 text-danger';
        resultBox.textContent = res.error;
      }
    });

    // Первичный расчёт при загрузке страницы
    updateLivePrice();
  });
}

// Экспорт функции для автоматизированного тестирования (Mocha / Chai)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateAndCalculateBooking };
}