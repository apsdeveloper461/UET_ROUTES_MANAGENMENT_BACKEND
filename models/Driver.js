const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const selectedDb = mongoose.connection.useDb('UET_SYSTEM');


const DriverSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:true},
    cnic:{type:String,required:true,unique:true},
    address:{type:String,required:true}
});


DriverSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

DriverSchema.methods.matchPassword=async function(enteredPassword){
    if(!enteredPassword){
        throw new Error("password not found");
    }
    return await bcrypt.compare(enteredPassword,this.password);
}

const DriverModel=selectedDb.model('uet_drivers',DriverSchema);


module.exports={DriverModel};