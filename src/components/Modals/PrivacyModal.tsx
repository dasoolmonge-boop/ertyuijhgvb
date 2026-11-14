import React from 'react';
import { useStore } from '../../context/StoreContext';
import './PrivacyModal.css';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyModalOpen, setIsPrivacyModalOpen } = useStore();

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="privacy-modal-backdrop" onClick={() => setIsPrivacyModalOpen(false)}>
      <div className="privacy-modal-card" onClick={e => e.stopPropagation()} role="dialog">
        <button
          className="privacy-modal-close"
          onClick={() => setIsPrivacyModalOpen(false)}
          aria-label="Закрыть"
        >
          ✕
        </button>

        <div className="privacy-modal-header">
          <span className="text-overline">KUZEL ПОЛИТИКА</span>
          <h3 className="privacy-modal-title">Политика обработки персональных данных</h3>
        </div>

        <div className="privacy-modal-content text-editorial">
          <h4>1. Общие положения</h4>
          <p>
            Настоящая Политика определяет порядок сбора, хранения и защиты персональной информации покупателей интернет-магазина тувинской национальной одежды KUZEL в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
          </p>

          <h4>2. Состав собираемых данных</h4>
          <p>
            При оформлении заказа или отправке заявки на обратный звонок собираются исключительно данные, необходимые для исполнения заказа:
          </p>
          <ul>
            <li>Фамилия, имя покупателя;</li>
            <li>Контактный номер телефона;</li>
            <li>Город и адрес доставки;</li>
            <li>Параметры и пожелания по меркам одежды.</li>
          </ul>

          <h4>3. Цели обработки</h4>
          <p>
            Персональные данные используются строго для:
          </p>
          <ul>
            <li>Подтверждения заказа и индивидуального подбора размера;</li>
            <li>Организации доставки изделий курьером или транспортными компаниями;</li>
            <li>Оперативной обратной связи администраторов магазина с клиентом.</li>
          </ul>

          <h4>4. Безопасность и нераспространение</h4>
          <p>
            Магазин KUZEL гарантирует, что персональные данные не передаются третьим лицам, за исключением служб доставки, задействованных в передаче заказа покупателю. Все внутренние уведомления передаются по защищённым протоколам.
          </p>
        </div>

        <div className="privacy-modal-footer">
          <button className="btn-primary" onClick={() => setIsPrivacyModalOpen(false)}>
            Принять и закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
