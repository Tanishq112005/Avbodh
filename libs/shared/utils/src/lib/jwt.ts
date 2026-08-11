import jwt from "jsonwebtoken";

function verifyAccessToken(token: string , key : string )  {
    try {
        const decoded = jwt.verify(token , key );
        return decoded;
    } catch (err: any) {
        return err;
    }
}
 
