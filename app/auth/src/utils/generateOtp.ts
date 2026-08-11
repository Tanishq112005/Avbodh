import { randomInt } from "crypto";


// function for generating the random 6 digit otp for the password verification
export function random6digitnumber()  {
     const otp = randomInt(100000, 999999).toString();
     return otp ; 
}