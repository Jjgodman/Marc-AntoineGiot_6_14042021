const Sauce = require('../models/Sauce');
const fs = require('fs');


//route pour récupérer toute les sauces
exports.getAllSauce = (req, res, next) => {
    //on récupère juste toute les sauces de la bdd
    Sauce.find().then(
        (sauce) =>{
            res.status(200).json(sauce)
        }
    )
    .catch(error => res.status(400).json({ error }));
};


//route pour récupèrer une seule sauce
exports.getOneSauce = (req, res, next) => {
    //on chercher la sauce dans la bdd via son id
    //si on la trouve alors on la renvoie
    Sauce.findOne({
        _id: req.params.id
      }).then(
        (sauce) => {
          res.status(200).json(sauce);
        }
      //sinon eroor 404
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
};

//route pour la création de sauces
exports.createSauce = (req, res, next) => {
  //on récupère les information indiqué par l'utilisateur, au quel on enleve l'id
  const newSauce = JSON.parse(req.body.sauce);
  delete newSauce._id;
  //on créer l'objet en utilisant le modèle Sauce
  const sauce = new Sauce({
    ...newSauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //on sauvegarde la sauce dans la bdd
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//route pour mettre à jour une sauce
exports.updateSauce = (req, res, next) => {
  //on vérifie si l'image doit changer
  let sauceObj = {};
  req.file ? (
  //si oui on la mets à jour en supprimant l'ancienne image
    
      Sauce.findOne({
        _id: req.params.id
      })
        .then ((sauce) => {
          //suppresion de l'ancienne image
          const filename = sauce.imageUrl.split('/images/')[1]
          fs.unlinkSync(`image/${filename}`)
        }),
        sauceObj = {
          //ajout de la nouvelle
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
      ) : (sauceObj={ ...req.body });
    //on mets a jour les détails de la sauce inscrit par l'utilisateur
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  //on recherche la sauce dans la bdd
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //on supprime son image
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`image/${filename}`, () => {
        //on supprime les détails de la sauce
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//route pour le systeme de j'aime
exports.usersLikes = (req, res, next) => {
  //récupération des données utiles
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;

  //si l'utilisateur aime la sauce
  if (like==1) {
    //on rajoute un j'aime et on l'inscrit dans les utilisateur aimant la sauce
    Sauce.updateOne({_id : sauceId}, {$push : {usersLiked : userId}, $inc : {likes : +1},})
      .then(() => res.status(200).json({message:'Il aime la sauce !'}))
      .catch ((error) => res.status(400).json({error}))
  }

  //s'il n'aime pas la sauce
  else if (like==-1) {
    //on rajoute un je n'aime pas et on l'inscrit dans les utilisateur n'aimant pas la sauce
    Sauce.updateOne({_id : sauceId}, {$push : {usersDisliked : userId}, $inc : {dislikes : +1},})
      .then(() => res.status(200).json({message:'Il n\'aime pas la sauce !'}))
      .catch ((error) => res.status(400).json({error}))
  }

  //s'il a déjà aimait ou pas la sauce et qu'il change d'avis
  else if (like==0) {
    Sauce.findOne({_id : sauceId})
      .then((sauce)=> {

        //s'il n'aime plus la sauce
        if (sauce.usersLiked.find(userId => userId === req.body.userId)) {
          //on enlève le j'aime et on l'enlève des utilisateur aimant la sauce
          Sauce.updateOne({_id : sauceId}, {$pull : {usersLiked : userId}, $inc : {likes : -1},})
            .then(() => res.status(200).json({message:'Finalement il n\'aime pas la sauce !'}))
            .catch ((error) => res.status(400).json({error}))
        }

        //s'il ne détèste plus la sauce
        else if (sauce.usersDisliked.find(userId => userId === req.body.userId)) {
          //on enlève le je n'aime pas et on l'enlève des utilisateur n'aimant pas la sauce
          Sauce.updateOne({_id : sauceId}, {$pull : {usersDisliked : userId}, $inc : {dislikes : -1},})
            .then(() => res.status(200).json({message:'Finalement il aime la sauce !'}))
            .catch ((error) => res.status(400).json({error}))
        }
      })
  }
};