const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauce) =>{
            res.status(200).json(sauce)
        }
    )
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
      }).then(
        (sauce) => {
          res.status(200).json(sauce);
        }
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
};

exports.createSauce = (req, res, next) => {
    const newSauce = JSON.parse(req.body.sauce);
    delete newSauce._id;
    const sauce = new Sauce({
        ...newSauce,
        imageUrl: `${req.protocol}://${req.get('host')}/sauce_image/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
      
};

exports.updateSauce = (req, res, next) => {
    let majSauce

    if(req.file) {
        
    }
};

exports.deleteSauce = (req, res, next) => {
    
};

exports.usersLikes = (req, res, next) => {
    
};