import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Estendi dayjs con i plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// Imposta il timezone predefinito
dayjs.tz.setDefault('Europe/Rome'); // o il tuo timezone

export default dayjs;
