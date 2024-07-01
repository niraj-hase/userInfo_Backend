
 module.exports.homePage = async (req,res)=>{
    try{
        console.log('home component called......');
        return res.status(201).json({
            success: true,
            message: 'home Page api rendered successfully'
        });
    }
    catch(err){
        console.log("Error in loading the home page ",err);
        return;
    }
}