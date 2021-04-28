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
  console.log(req.body.sauce)
  const newSauce = req.body.sauce;
  delete newSauce._id;
  const sauce = new Sauce({
    ...newSauce,
    imageUrl: `${req.protocol}://${req.get('host')}/sauce_image/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
  /*delete req.body._id;
  console.log(req.body)
  const sauce = new Sauce({
    ...req.body.sauce
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));*/
};

exports.updateSauce = (req, res, next) => {
    let majSauce

    if(req.file) {
        Sauce.findOne({_id: req.params.id})
          .then(sauce => {
            const fileImg = sauce.imageUrl.split('/sauce_image/'[1])
            fs.unlink(`sauce_image/${filename}`, function (error) {
              if (error) throw error;
            });
          })
          .catch(error =>res.status(500).json({error}));

          let infoSauce = JSON.parse(req.body.sauce);

          majSauce = {
            name: infoSauce.name,
            manufacturer: infoSauce.manufacturer,
            description: infoSauce.description,
            mainPepper: infoSauce.mainPepper,
            heat: infoSauce.heat,
            userId: infoSauce.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/sauce_image/${req.file.fileImg}`
          }
    }
    else {
      majSauce = {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId
      }
    }
    Sauce.updateOne({ _id: req.params.id }, {...majSauce, _id: req.params.id})
      .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({error}))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce=> {
        const fileImg = sauces.imageUrl.split('/sauce_image/')[1];
        fs.unlink(`sauce_image/${fileImg}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.usersLikes = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    if (like == 1) {
      Sauce.updateMany(
        {_id: sauceId},
        {
          $inc: {likes:1},
          $push:{usersliked:userId}
        }
      )
      .then(() => res.status(200).json({ message: 'Il aime la sauce ! !'}))
      .catch(error => res.status(404).json({ error }));
    }

    else if (like==-1) {
      Sauce.updateMany(
        {_id: sauceId},
        {
          $inc: {dislikes:1},
          $push:{usersliked:userId}
        }
      )
      .then(() => res.status(200).json({ message: 'Il n\'aime pas la sauce ! !'}))
      .catch(error => res.status(404).json({ error }));
    }

    else {
      Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        if (sauce.usersliked.find(userId => userId === req.body.userId)) {
          Sauce.updateMany(
            {_id: sauceId},
            {
              $inc: {dislikes: -1},
              $pull: {usersDisliked: userId}
            }
          )
          .then(() => { res.status(200).json({message:'Il n\'est pas d\'accord avec lui même, finalement il n\'aime pas cette sauce'})})
          .catch(error => res.status(404).json({ error }));
        }
        else {
          Sauce.updateMany(
            {_id: sauceId},
            {
              $inc: {dislikes: -1},
              $pull: {usersLiked: userId}
            }
          )
          .then(() => { res.status(200).json({message:'Il n\'est pas d\'accord avec lui même, finalement il aime cette sauce'})})
          .catch(error => res.status(404).json({ error }));
        }
      })
      .catch(error => res.status(404).json({ error }));
    }
};