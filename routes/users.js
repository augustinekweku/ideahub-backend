const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                res.status(500).json(error);
            }
        }

        try { 
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body,
            });
            res.status(200).json("Account updated succesfully")
        } catch (error) {
            res.status(500).json(error); 
        }
    } else {
        return res.status(403).json("You can update only your account") 
    }
});

//delete a user
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try { 
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted succesfully")
        } catch (error) {
            res.status(500).json(error); 
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
});



// get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //return all user properties except password and updatedAt 
        //create an object and use the spread operator to store other properties
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})

// follow a user
router.put("/:id/follow", async (req, res) => {
    //checking if the logged in user is trying to follow himself
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //checking if the user is already following that user
            if (!user.followers.includes(req.body.userId)) {
                //update the user's followers
                await user.updateOne({ $push: { followers: req.body.userId}});
                //update the logged in user's following
                await currentUser.updateOne({ $push: { following: req.params.id}});
                res.status(200).json("user followed")
            } else {
                res.status(403).json("You already follow this user"); 
            }
        } catch (error) {
            res.status(403).json("You cant follow yourself")
        }
        
    }
})

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId}});
                await currentUser.updateOne({ $pull: { following: req.params.id}});
                res.status(200).json("user unfollowed")
            } else {
                res.status(403).json("You dont follow this user");
            }
        } catch (error) {
            res.status(403).json("You cant unfollow yourself")
        }
        
    }
})


module.exports = router;