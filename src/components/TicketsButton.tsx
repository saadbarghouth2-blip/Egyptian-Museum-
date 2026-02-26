import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import './TicketsButton.css';

export default function TicketsButton() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="tickets-float-button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
    >
      <Link to="/tickets" className="tickets-link">
        <motion.div
          className="tickets-pulse"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Ticket size={24} />
        <span>{t('common.tickets')}</span>
      </Link>
    </motion.div>
  );
}

