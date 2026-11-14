import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import './Cart.css';

interface OrderState {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
  comment: string;
  privacyConsent: boolean;
}

const initialOrderState: OrderState = {
  customerName: '',
  phone: '',
  city: 'Кызыл',
  address: '',
  deliveryMethod: 'Курьерская доставка по Кызылу',
  paymentMethod: 'При получении (наличными / переводом)',
  comment: '',
  privacyConsent: true,
};

const Cart: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    setIsPrivacyModalOpen,
  } = useStore();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [formData, setFormData] = useState<OrderState>(initialOrderState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<number | null>(null);

  const total = cart.reduce((sum, item) => {
    const price = item.product.price === 'Цена по запросу' ? 0 : parseInt(item.product.price.replace(/\D/g, '')) || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleClose = () => {
    setIsCartOpen(false);
    if (successOrderNumber) {
      setIsCheckoutStep(false);
      setSuccessOrderNumber(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      setSubmitError('Пожалуйста, введите ваше имя и фамилию.');
      return;
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setSubmitError('Пожалуйста, укажите действующий номер телефона (не менее 10 цифр).');
      return;
    }

    if (!formData.city.trim()) {
      setSubmitError('Пожалуйста, укажите город доставки.');
      return;
    }

    if (!formData.privacyConsent) {
      setSubmitError('Необходимо согласие на обработку персональных данных.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        comment: formData.comment.trim(),
        privacyConsent: formData.privacyConsent,
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          type: item.product.type,
          priceText: item.product.price,
          size: item.size || 'По меркам',
          quantity: item.quantity,
          image: item.product.image,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не удалось оформить заказ. Попробуйте позже.');
      }

      // Order created successfully on server and dispatched to Telegram admins!
      setSuccessOrderNumber(data.orderNumber);
      clearCart();
    } catch (err: any) {
      setSubmitError(err.message || 'Ошибка связи с сервером при отправке заказа.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`cart-backdrop ${isCartOpen ? 'visible' : ''}`}
        onClick={handleClose}
      />

      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`} role="dialog" aria-label="Корзина">
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <h2 className="cart-drawer__title">
              {successOrderNumber ? 'ЗАКАЗ ПРИНЯТ' : isCheckoutStep ? 'ОФОРМЛЕНИЕ ЗАКАЗА' : 'КОРЗИНА'}
            </h2>
            {!successOrderNumber && (
              <span className="cart-drawer__count">
                {cartCount} {cartCount === 1 ? 'изделие' : cartCount > 1 && cartCount < 5 ? 'изделия' : 'изделий'}
              </span>
            )}
          </div>
          <button
            className="cart-drawer__close"
            onClick={handleClose}
            aria-label="Закрыть корзину"
          >
            ✕
          </button>
        </div>

        {/* 1. Success Screen after Server Confirmation */}
        {successOrderNumber ? (
          <div className="cart-drawer__success">
            <div className="cart-drawer__success-mark">✓</div>
            <h3 className="cart-drawer__success-title">Спасибо за заказ!</h3>
            <p className="cart-drawer__success-num">Заказ №{successOrderNumber}</p>
            <p className="cart-drawer__success-msg text-editorial">
              Мы получили вашу заявку и передали её администраторам. В ближайшее время наш мастер свяжется с вами по указанному телефону для подтверждения мерок и деталей доставки.
            </p>
            <div className="cart-drawer__success-actions">
              <button
                className="btn-primary"
                onClick={handleClose}
              >
                Вернуться к покупкам
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* 2. Empty State */
          <div className="cart-drawer__empty">
            <span className="cart-drawer__empty-mark">◇</span>
            <p className="cart-drawer__empty-title">ВАША КОРЗИНА ПУСТА</p>
            <p className="cart-drawer__empty-desc text-editorial">
              Выберите понравившиеся изделия из коллекций KUZEL, чтобы оформить заказ у мастера.
            </p>
            <button className="btn-primary" onClick={handleClose}>
              Перейти к коллекциям
            </button>
          </div>
        ) : !isCheckoutStep ? (
          /* 3. Items List View */
          <>
            <div className="cart-drawer__items">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item__media">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="cart-item__body">
                    <span className="cart-item__cat">{item.product.type}</span>
                    <h4 className="cart-item__title">{item.product.name}</h4>
                    <span className="cart-item__price">{item.product.price}</span>
                    <span className="cart-item__size">Размер: {item.size || 'По меркам'}</span>

                    {/* Quantity Selector */}
                    <div className="cart-item__qty-control">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Уменьшить количество"
                      >
                        –
                      </button>
                      <span className="cart-item__qty-val">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label={`Удалить ${item.product.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total-row">
                <span className="cart-drawer__total-label">ИТОГО</span>
                <span className="cart-drawer__total-val">
                  {total > 0 ? `${total.toLocaleString('ru-RU')} ₽` : 'По запросу'}
                </span>
              </div>
              <p className="cart-drawer__note">
                Индивидуальные мерки, сроки пошива и точная стоимость доставки подтверждаются менеджером при оформлении.
              </p>
              <button
                className="btn-primary cart-drawer__checkout-btn"
                onClick={() => setIsCheckoutStep(true)}
              >
                Перейти к оформлению
              </button>
            </div>
          </>
        ) : (
          /* 4. Checkout Form View */
          <form className="cart-checkout-form" onSubmit={handleSubmitOrder}>
            <div className="cart-checkout-form__scroll">
              <button
                type="button"
                className="cart-checkout-form__back"
                onClick={() => setIsCheckoutStep(false)}
              >
                ← Вернуться к списку товаров
              </button>

              {submitError && (
                <div className="cart-checkout-form__error">
                  {submitError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="customerName">
                  Имя и фамилия *
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  className="form-input"
                  placeholder="Иван Иванов"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Номер телефона *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder="+7 (999) 000-00-00"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  Город доставки *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder="Кызыл"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  Адрес доставки (улица, дом, квартира)
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  placeholder="ул. Ленина, д. 10, кв. 5"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="deliveryMethod">
                  Способ доставки
                </label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  className="form-select"
                  value={formData.deliveryMethod}
                  onChange={handleInputChange}
                >
                  <option value="Курьерская доставка по Кызылу">Курьерская доставка по Кызылу</option>
                  <option value="СДЭК по всей России">СДЭК по всей России</option>
                  <option value="Почта России">Почта России</option>
                  <option value="Самовывоз из ателье (Кызыл)">Самовывоз из ателье (Кызыл)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="paymentMethod">
                  Способ оплаты
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="form-select"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="При получении (наличными / переводом)">При получении (наличными / переводом)</option>
                  <option value="Банковской картой онлайн (по ссылке мастера)">Банковской картой онлайн (по ссылке мастера)</option>
                  <option value="По согласованию с менеджером">По согласованию с менеджером</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="comment">
                  Комментарий или пожелания по меркам
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  className="form-textarea"
                  placeholder="Укажите ваш рост, обхват груди или удобное время для звонка"
                  rows={2}
                  value={formData.comment}
                  onChange={handleInputChange}
                />
              </div>

              {/* Privacy Consent */}
              <div className="form-consent">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleInputChange}
                    required
                  />
                  <span>
                    Я согласен на{' '}
                    <button
                      type="button"
                      className="form-privacy-link"
                      onClick={() => setIsPrivacyModalOpen(true)}
                    >
                      обработку персональных данных
                    </button>
                  </span>
                </label>
              </div>
            </div>

            <div className="cart-drawer__footer">
              <button
                type="submit"
                className="btn-primary cart-drawer__checkout-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка заказа...' : 'Подтвердить заказ'}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
};

export default Cart;
