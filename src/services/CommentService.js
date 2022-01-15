const {models} = require('../models');
const Util = require('../util/Utility');
const { Op } = require("sequelize");


class CommentService{


    add(userID,authorName,rate,proID,sumary,coms){
        if (userID=='')
            userID=null;
        return models.comment.create({
            userID: userID,
            authorName: authorName,
            rate: rate,
            proID:proID,
            sumary:sumary,
            com:coms
        })
    }
}

module.exports = new CommentService; 