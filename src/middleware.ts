import cors from "cors";
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';



export function corsMiddleware() {
    return cors({
        origin: process.env.WEBSITE_DOMAIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    })
};


export const protectedRoutesMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const domain = process.env.API_DOMAIN
        try {
            const response = await axios.post(
                domain + '/api/auth/validate',
            );

            if (response.status === 200 && response.data?.userId) {
                req.headers['x-user-id'] = response.data.userId;
                next();
            } else {
                res.status(401).send('Unauthorized: Invalid session');
            }
        } catch (error) {
            console.error('Error validating session:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};



