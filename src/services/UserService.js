const {models} = require('../models');

class UserService{
    findAccount(username){
        return models.user.findOne({
            raw: true,
            where:{
                f_username: username,
            }
        })
    }

    findByID(id){
        return models.user.findOne({
            raw:true,
            where:{
                f_ID:id
            }
        })
    }
}

module.exports = new UserService;