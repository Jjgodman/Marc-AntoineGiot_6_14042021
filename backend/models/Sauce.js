const mongoose = require('mongoose');

//modèle pour la création de sauce
const saucesShema = mongoose.Schema({
    userId: { type: String, require: true},                       
    name: { type: String, require: true},                        
    manufacturer: { type: String, require: true},                
    description: { type: String, require: true},                
    mainPepper: { type: String, require: true},                   
    imageUrl: { type: String, require: true},                     
    heat: { type: Number, require: true},                        
    likes: { type: Number, default:0, require: true},             
    dislikes: { type: Number, default:0, require: true},         
    usersLiked: { type: Array, default:[], require: true},        
    usersDisliked: { type: Array, default:[], require: true}     
});

module.exports = mongoose.model('Sauces',saucesShema);