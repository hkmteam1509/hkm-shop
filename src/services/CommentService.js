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

    list(limit,page,proID){
        return models.comment.findAll({
            offset: (page - 1)*limit, 
            limit: limit,
            raw:true,
            where:{
                proID:proID
            }
        })
    }

    totalComment(proID){
        return models.comment.count({
            where:{
                proID: proID
            }
        })
    }
}

module.exports = new CommentService; 