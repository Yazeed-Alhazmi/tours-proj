import {rateLimit} from 'express-rate-limit';


export const loginRateLimit = rateLimit({
    max: 5,
    window: 60 * 60 * 1000,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'To many request, please try again in an hour!'
});