import rateLimit from 'express-rate-limit';

const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;
const ONE_HOUR = 60 * ONE_MINUTE;

const slightly = rateLimit({
    windowsMs: FIFTEEN_MINUTES,
    max: 100,
});

const heavily = rateLimit({
    windowMs: ONE_HOUR,
    max: 5,
});

export default { slightly, heavily };
