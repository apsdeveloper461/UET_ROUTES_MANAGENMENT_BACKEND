const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const selectedDb = mongoose.connection.useDb('CN');
const AdminSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
  
// hello this for the pre condition on save the data
//pre condition on save the data
AdminSchema.pre('save',async function(next){
    // console.log("pre save");
    // if password is not modify , then got to next 
    if(!this.isModified("password")){
        return next();
    }
    // if password is changed and stored then hash it 
    const salt=await bcrypt.genSalt(10);

    this.password=await bcrypt.hash(this.password,salt);
    next();
})


AdminSchema.methods.matchPassword=async function(enteredPassword){
    // console.log(this.password);
    
    if(!enteredPassword){
        throw new Error("password not found");
        
    }
        return await bcrypt.compare(enteredPassword,this.password);
}

const AdminModel=selectedDb.model('uet_admins',AdminSchema);

module.exports={AdminModel};