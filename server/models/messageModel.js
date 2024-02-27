const mongoose= require("mongoose");
const Cryptr= require('cryptr');
const cryptr= new Cryptr(`${process.env.CRYPTR_SECRET}`);

const messageSchema= new mongoose.Schema(
    {
        message:{
            text:{
                type: String,
                required: true
            }
        },
        users: Array,
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
    )

messageSchema.pre('save', function(next){
    this.message.text= cryptr.encrypt(this.message.text);
    next();
})

messageSchema.post('find', function(document){
    for(let i=0; i<document.length; i++){
        document[i].message.text= cryptr.decrypt(document[i].message.text);
    }
})

module.exports= mongoose.model("Messages", messageSchema);