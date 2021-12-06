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

    createUser({firstname, lastname, username, email, password}){
        return models.user.create({
            f_userName: username,
            f_password: password,
            f_lastname: lastname,
            f_firstname: firstname,
            f_email: email,
            f_permission: 0,
        })
    }

    getShipping(id){
        return models.shipping.findOne({
            raw: true,
            where:{
                userID: id
            }
        })
    }

    updateUser(userID, firstname, lastname, address, phone, day, month, year, gender){
        let date = new Date();
        date.setFullYear(year, month - 1, day);
        return models.user.update({
            f_firstname: firstname,
            f_lastname: lastname,
            f_phone: phone,
            f_address: address,
            f_DOB: date,
            f_sex: gender
        },{
            where:{
                f_ID:userID
            }
        })
    }

    createShipping(userID, firstname, lastname, phone, province, district, ward, address){
        return models.shipping.create({
            userID: userID,
            f_firstname: firstname,
            f_lastname: lastname,
            f_phone: phone,
            country:"Vietnam",
            address: address,
            province: province,
            distric: district,
            ward: ward
        })
    }

    updateShipping(userID, firstname, lastname, phone, province, district, ward, address){
        return models.shipping.update({
            f_firstname: firstname,
            f_lastname: lastname,
            f_phone: phone,
            address: address,
            province: province,
            distric: district,
            ward: ward
        },{
            where:{
                userID: userID
            }
        })
    }

    updatePassword(userID, password){
        return models.user.update({
            f_password: password
        },{
            where:{
                f_ID: userID
            }
        })
    }
}

module.exports = new UserService;