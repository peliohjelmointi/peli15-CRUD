const express = require('express')
const path = require('path')
const lodash = require('lodash')
const session = require('express-session')
const mongo_connection = require('./mongo_connection') //ajaa connectToMongo()
const Blog = require('./models/blog')

const app = express() //initialisoidaan ohjelma express-aplikaatioksi
const port = 3000

//asetetaan tietokanta jota käytetään (vrt. SQL: use UsersDB)
//mongoose exportatiin mongo_connection:iin
// huom. luo tietokannan, jos sitä ei ole olemassa
const db = mongo_connection.connection.useDb("FoodDB")

//asetaan käytettävä collection (luodaan jos ei olemassa)
const coll = db.collection('VegetableCollection')

// asetaan ohjelma käyttämään ejs-templatea "view-enginenä"
app.set('view engine', 'ejs') //oletuksena hakee ejs-tiedostot views-kansiosta
//----------------------------------------------------------------------

// mahdollisetaan requestiin sivulta tietojen kerääminen
// esim. req.body
app.use(express.urlencoded({ extended: false }))

// asetetaan session-asetukset
app.use(session({
    secret: 'adsöfölkjadsf',
    resave: false,
    saveUninitialized: true,
    //cookie: { maxAge: 60000} //ms = 60secs //vapaaehtoinen
    //jos maxAge ei aseta, niin sessio säilyy, kunnes selain suljetaan
}))
//asetaan staattisen sisällön kansio: (yleensä nimellä public tai static)
app.use(express.static('public'))

//-----------------------------------------------------------------
// ROUTES eli REITITYKSET eli END-POINTS
app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'] //mikä käyttöjärjestelmä/selain
    console.log(userAgent)
    const userLocale = req.headers['accept-language'] //käyttäjän koneen kielet
    console.log(userLocale)
    //const username = req.query.kayttaja

    //query-string esimerkki
    //res.render('index', {username:req.query.XXX})

    //session-esimerkki:
    const username = req.session.user || "Guest"

    const blogs = [
        {title: ' My first blog', snippet: ' First log ever!'},
        {title: ' My second blog!', snippet: 'This is fun!'}
    ]

    res.render('index', { title:'ALL BLOGS', blogs })

})

app.get('/add-blog', (req,res)=>{
    const blog = new Blog( {
        title: ' My first blog!',
        description: 'testing testing',
        blogText: 'Olipa kerran myrskyisä aamu...'
    })
    blog.save()
    .then((result) =>{
        res.send(result) //näyttää JSON-muodossa sivulla
    })
    .catch((err)=>{
        console.log(err)
    })
})


app.get('/add_vegetable', async (req, res) => {
    try {
        await coll.insertOne(
            {
                name: 'carrot',
                color: 'orange',
                weight: 0.5
            }
        )
        res.send("vegetable added to db..")
    }
    catch (err) {
        res.send(err)
    }
})



app.get('/ejs', (req, res) => {
    // res.render hakee määritetyn views-kansion sijainnin
    // ja kääntää template-enginen tiedoston (esim. index.ejs) html-muotoon
    // lisäksi injektoi javascript-muuttujat html-kielen sekaan
    // Lähettää html-sivun http-responsena serveriltä clientille (käyttäjälle)
    res.render('index') //views-kansion index.ejs
})


app.get('/login', (req, res) => {
    res.render('login') //renderöi views/login.ejs -tiedoston
})
app.post('/login', (req, res) => {
    //console.log("LOGIN POST:IIN TULTIIN")
    //res.redirect('/') // siirtyy / endpoint:iin
    // HUOM! res.redirect EI vie template-muuttujia
    //res.redirect('http://www.google.com')
    //res.render('index', {kayttaja:req.body.name})

    //query string tapa, jos halutaan käyttää redirect / 
    // ja viedä käyttäjän nimi / endpointtiin
    //res.redirect(`/?XXX=${encodeURIComponent(req.body.name)}`)

    //session-tapa: npm i express-session
    req.session.user = req.body.name
    res.redirect('/')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

