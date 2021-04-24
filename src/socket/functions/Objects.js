module.exports = {
    removeByAttribute(object, attribute, value) {
        var i = object.length;
        while(i--) {
            if(object[i] && (arguments.length > 2 && object[i][attribute] === value)) { 
                object.splice(i,1);
            }
        }
        
        return { object, success: !!(i < object.length) };
    }
}