import * as dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT
export const SECRET_KEY = process.env.SECRET_KEY
export const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH