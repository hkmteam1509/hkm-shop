class Utility{
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    getUIBrandName(brand){
        if(brand){
            const tokens = brand.split('-').map(str => {
                return this.capitalizeFirstLetter(str);
            });
            const result = tokens.join(" ");
            return result;
        }
        else{
            return null;
        }
    }
    
    getDataSlug(data){
        if(data){
            let str = data.toLowerCase();
            let tokens = str.split(" ");
            return tokens.join("-");
        }
        else{
            return null
        }
       
    }


    getUIgender(gender){
        if(gender){
            return this.capitalizeFirstLetter(gender);
        }
        return null;
    }

    getUICategory(category){
        if(category){
            return this.capitalizeFirstLetter(category);
        }
        return null;
        
    }
}

module.exports = new Utility;