const {models} = require('../models');
const Util = require('../util/Utility');
const { Op } = require("sequelize");


class CommentService{
    add(userID,authorName,rate,proID,sumary,com){
        let dateCom=Date.now().toLocaleString;
        return models.comment.create({
            userID: userID,
            authorName: authorName,
            rate: rate,
            dateComment: dateCom,
            proID:proID,
            sumary:sumary,
            com:com,
        })
    }
}

module.exports = new CommentService;