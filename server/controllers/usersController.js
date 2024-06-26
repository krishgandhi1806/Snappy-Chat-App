const User= require("../models/userModel");
const bcrypt= require("bcrypt");

module.exports.register= async (req, res, next)=>{
try{
    const {username, email, password}= req.body;
        const usernameCheck= await User.findOne({ username });
        if(usernameCheck){
            return res.json({
                msg: "Username already exists",
                status: false
            })
        }
        const emailCheck= await User.findOne({ email });
        if(emailCheck){
            return res.status(400).json({
                msg: "Email already in use",
                status: false
            })
        }
    const hashedPassword= await bcrypt.hash(password, 10);
    const user= await User.create({
        email,
        username,
        password: hashedPassword
    });
    delete user.password;
    return res.json({
        user,
        status: true
    })  
}catch(err){
    console.log(err);
}
}


module.exports.login= async (req, res, next)=>{
try{
    const {username, password, newPassword}= req.body;
        const user= await User.findOne({ username });
        if(!user){
            return res.json({
                msg: "Incorrect username or password",
                status: false
            })
        }
        // const emailCheck= await User.findOne({ email });
        const isPasswordValid= await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({
                msg: "Incorrect username and password",
                status: false
            })
        }
        delete user.password;
        const hashedPassword= await bcrypt.hash(newPassword, 10);

        const newUser= await User.findByIdAndUpdate(user._id, {
            $set:{
                password: hashedPassword
            }
        }).select("-password");

        return res.json({
            newUser,
            status: true
    })  
}catch(err){
    console.log(err);
}
}

module.exports.setAvatar= async (req, res, next)=>{
    try{
        const userId= req.params.id;
        const avatarImage= req.body.image;
        const userData= await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        });
    }catch(err){
        next(err);
    }
}

module.exports.getAllUsers= async(req, res, next)=>{
try{

    const users= await User.find({_id: {$ne: req.params.id}}).select([
        "email",
        "username",
        "avatarImage",
        "_id"
    ]);
    // console.log(users);
    return res.json(users);
}catch(err){
    next(err);
}
}

// module.exports.logout= async (req, res)=>{
//     const {id, currentPassword}= req.headers;
//     await User.findOneAndUpdate({_id: id}, {
//         $set:{
//             oldPassword: currentPassword,
//             password: "12345678"
//         }
//     });

//     return res.status(200).json({
//         message: "User logged out successfully!"
//     })
// }