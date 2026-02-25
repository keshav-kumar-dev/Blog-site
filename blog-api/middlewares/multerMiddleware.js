const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file, cb){
        cb(null,"./uploads")
    },
    filename : function(req,file,cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1E9);
        cb(null,file.fieldname+"-"+uniqueSuffix);
    }
})

const upload = multer({
    storage:storage,
    limits:{
        fieldSize:2*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        const allowedTypes = /jpg|png|jpeg/;
        const isExtentionAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const isMIMEValid = allowedTypes.test(file.mimetype);

        if(isExtentionAllowed && isMIMEValid){
            return cb(null,true);
        }else{
            cb(new Error("Only image is allowed(.jpg,jpeg,png)"));
        }
    }
});

module.exports = upload;
