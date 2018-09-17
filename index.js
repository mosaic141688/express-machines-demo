const express = require('express')
const machine = require('machine')
const { readdirSync, statSync } = require('fs')
const { join } = require('path')

const body_parser = require('body-parser')



const dirs = p => readdirSync(p)
    .filter(f => statSync(join(p, f)).isDirectory())


const app = express()
app.use(body_parser.urlencoded({ extended: true }))
//app.use(body_parser.json())


let controler_directories = dirs('./src/controllers')



let machines = controler_directories.map(cd => {
    return {
        path:`/${cd}`,
        methods:{
            get:machine(require(`./src/controllers/${cd}/find`))
        }
    }
})

app.get('/', (req, res) => res.send('Hello World!'))

machines.forEach(mc => {
    Object.keys(mc.methods).forEach(verb => app[verb](`${mc.path}`,async (req,res)=>{
        let {params,body,query} = req;
        try{
            let result = await mc.methods[verb]({...params,...body,...query})
            res.send(result)
        }catch(e){
            console.log(Object.keys(e))
            res.status(401).send(e.problems)
        }
    }))
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))