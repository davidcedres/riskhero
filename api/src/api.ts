import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import { expressjwt as jwt } from 'express-jwt'
import morgan from 'morgan'

import areas from './controllers/areas.js'
import categories from './controllers/categories.js'
import evidences from './controllers/evidences.js'
import inspections from './controllers/inspections.js'
import observations from './controllers/observations.js'
import reports from './controllers/reports.js'
import sessions from './controllers/sessions.js'
import users from './controllers/users.js'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(
    jwt({
        secret: process.env.SECRET!,
        algorithms: ['HS256']
    }).unless({ path: ['/sessions'] })
)

app.use('/areas', areas)
app.use('/inspections', inspections)
app.use('/users', users)
app.use('/sessions', sessions)
app.use('/categories', categories)
app.use('/observations', observations)
app.use('/evidences', evidences)
app.use('/reports', reports)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
