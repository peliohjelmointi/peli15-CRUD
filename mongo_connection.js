const mongoose = require('mongoose')

const mongoURI = 'mongodb+srv://kayttajanimi:salasana@cluster0.37ex2rd.mongodb.net/OLETUSTIETOKANNAN_NIMI?retryWrites=true&w=majority&appName=Cluster0'

//käytetäänkö schemoja vai ei:
mongoose.set('strictQuery',false)

async function connectToMongo(){
   try{
    await mongoose.connect(mongoURI, {maxPoolSize:10}) //maksimi yht'aikaisten käyttäjien määrä
    console.log("connected to mongo")
   }
   catch(err){
    console.log(err)
   } 
}


connectToMongo()
module.exports = mongoose // nyt tähän mongooseen pääsee käsiksi muualta

// aja tiedosto jos haluat testata yhteyttä:
// node mongo_connection.js