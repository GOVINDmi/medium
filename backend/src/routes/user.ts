import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign,decode } from 'hono/jwt'
import axios from "axios"
import * as serviceAccount from '../medium-413fd-firebase-adminsdk-akkw3-a95c0dbb9e.json';
import { signupInput, signinInput } from "@govindmishra/mediumpackage";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        PRIVATE_KEY: string;
        ISS:string;
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(400); // Changed to 400 for bad request
        return c.json({
            message: "Inputs not correct"
        });
    }
    console.log(c.env.DATABASE_URL);
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password, // Consider hashing the password
                name: body.name,
                fcmtoken: body.token,
            }
        });
        const author = user.name || "Anonymous User";
        const token = sign({ id: user.id },c.env.PRIVATE_KEY, 'RS256');

        return c.json({ token, author });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.text('Server error');
    }
});

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(400); // Changed to 400 for bad request
        return c.json({
            message: "Inputs not correct"
        });
    }

  

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: body.username,
                password: body.password, // Consider verifying against hashed password
            }
        });
        if (!user) {
            c.status(403);
            return c.json({
                message: "Incorrect credentials"
            });
        }

        const iat = Math.floor(Date.now() / 1000);  // Current timestamp in seconds
        const exp = iat + 3600;  // Expiry time: 1 hour later
        
        // Define the payload
        const paylo = {
          "iss": c.env.ISS,
          "scope": "https://www.googleapis.com/auth/firebase.messaging",
          "aud": "https://oauth2.googleapis.com/token",
          "id":user.id
        };
        
        // Replace line breaks in the private key
        const privatek = serviceAccount.private_key.replace(/\\n/g, '\n');
     
        console.log(c.env.PRIVATE_KEY);
       
        const token = await sign(paylo,c.env.PRIVATE_KEY,"RS256");
       // console.log(token);
        const {header,payload} = decode(token);
        //console.log(header);
      

       

        return c.json({
            token,
            author:user.name
           
        });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.text('Server error');
    }
});
