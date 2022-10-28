import express from "express";

export async function basicAuth(req:express.Request, res:express.Response, next:express.NextFunction) {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if(! (username === "admin" && password === "admin")){
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    next();
}
