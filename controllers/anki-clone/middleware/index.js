import jwt from 'jsonwebtoken'

// Middleware to validate token 
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'No authentication token was found' })

    try {
        // Every route with this middleware will have the name and id of the current user in 
        // the request object

        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified

        // Check for token timeout
        const creationTime = new Date(req.user.created);
        const now = new Date();
        const delta = now.getTime() - creationTime.getTime();
        
        if (delta > process.env.TOKEN_EXPIRATION_TIME){
            return res.status(401).json({message: 'The given token has timed out'});
        }

        next()
    } catch (error) {
        return res.status(401).json({message: 'The given token is not valid'});
    }
}

export {verifyToken}