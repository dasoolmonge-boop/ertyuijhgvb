import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import './LeadModal.css';

export const LeadModal: React.FC = () => {
  const { leadModalConfig, closeLeadModal, setIsPrivacyModalOpen } = useStore();
  const { isOpen, type, productName } = leadModalConfig;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'callback':
        return 'ЗАКАЗАТЬ ОБРАТНЫЙ ЗВОНОК';
      case 'consultation':
        return productName ? `КОНСУЛЬТАЦИЯ: ${productName}` : 'КОНСУЛЬТАЦИЯ ПО РАЗМЕРУ';
      case 'feedback':
      default:
        return 'ЗАДАТЬ ВОПРОС МАСТЕРУ';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'callback':
        return 'Оставьте ваши контакты, и администратор KUZEL перезвонит вам в течение 15 минут.';
      case 'consultation':
        return 'Мастер поможет подобрать точный размер по вашим меркам и расскажет об особенностях пошива.';
      case 'feedback':
      default:
        return 'Напишите ваш вопрос или пожелание по изделиям тувинской национальной одежды.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Пожалуйста, укажите ваше имя.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Пожалуйста, укажите корректный номер телефона.');
      return;
    }

    if (!privacyConsent) {
      setError('Необходимо согласие на обработку персональных данных.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          productName: productName || '',
          type,
          privacyConsent,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при отправке заявки.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка связи с сервером.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeLeadModal();
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setError(null);
      setIsSuccess(false);
    }, 300);
  };

  return (
    <div className="lead-modal-backdrop" onClick={handleClose}>
      <div className="lead-modal-card" onClick={e => e.stopPropagation()} role="dialog">
        <button className="lead-modal-close" onClick={handleClose} aria-label="Закрыть">
          ✕
        </button>

        {isSuccess ? (
          <div className="lead-modal-success">
            <span className="lead-modal-success-mark">✓</span>
            <h3 className="lead-modal-title">Заявка принята!</h3>
            <p className="lead-modal-desc text-editorial">
              Спасибо за обращение. Мы получили вашу заявку и отправили уведомление администратору в Telegram. Скоро свяжемся с вами!
            </p>
            <button className="btn-primary" onClick={handleClose}>
              Понятно
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="lead-modal-form">
            <span className="text-overline">KUZEL СЕРВИС</span>
            <h3 className="lead-modal-title">{getTitle()}</h3>
            <p className="lead-modal-desc text-editorial">{getSubtitle()}</p>

            {error && <div className="lead-modal-error">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="leadName">Ваше имя *</label>
              <input
                id="leadName"
                type="text"
                className="form-input"
                placeholder="Как к вам обращаться"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="leadPhone">Номер телефона *</label>
              <input
                id="leadPhone"
                type="tel"
                className="form-input"
                placeholder="+7 (999) 000-00-00"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="leadMessage">Ваш вопрос или мерки (рост, размер)</label>
              <textarea
                id="leadMessage"
                className="form-textarea"
                rows={3}
                placeholder="Напишите ваш комментарий"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            <div className="form-consent">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={e => setPrivacyConsent(e.target.checked)}
                  required
                />
                <span>
                  Согласен на{' '}
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

            <button
              type="submit"
              className="btn-primary lead-modal-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
