
# UET Routes Management System

## Project  Models:

### User Model

        - username : string
        - email : string
        - password : string
        - isVerified : bool

### Admin Model

        - username : string
        - email : string
        - password : string

### Driver Model

        - name : string
        - email : string
        - password : string
        - phone : string
        - cnic : string
        - address : string

### Stop Model

        - name : string
        - latitude : number
        - longitude : number
### Route Model

        - route_no : string
        - vehicle_no : string
        - driver : Driver(ref)
        - stops[] : Stop(ref)







## Project Routes 
This is the backend of my project, in this project have routes:

## LogIn Functionality(Admin Panel):

### api/admin/login

        - POST request
        - In request body accept {email,password}
        - give {token} for setting to get data of user at anytiem in application

### api/admin/

        - GET request
        - give back data in object as {date:{}}
 
### api/admin/change-password

        - POST request
        - In request body have   {token, password}
        - only change password, after that you login to website for further operation.

## Manage Driver(Admin Panel):

### api/admin/driver/add-driver

        - POST request
        - in body accept { token, name, email, password, phone, cnic, address }  , token is verify the token provided by admin is valid or not.

### api/admin/driver/update-driver

        - POST request
        - in body accept { token, driver_id, name, email, password, phone, cnic, address },
        according to driver_id change every thing in database.

###  api/admin/driver

        - GET request
        - give back all driver details.


## Manage Stops(Admin Panel):

### api/admin/stop

        - GET request
        - give back all stop 

### api/admin/stop/add-stop

        - POST request
        - in request body { token, name, latitude,longitude } , token for admin is valid or not

### api/admin/stop/update-stop

        - POST request
        -  in request body  { token, stop_id, name, latitude,longitude } , acccording to stop_id update all stop details.


## Manage Routes(Admin Panel):

### api/admin/route/add-route

        - POST request
        - In body request {{token, route_no,vehicle_no,driver_id}} , driver_id ref to driver table in databse.

### api/admin/route/update-route

        - POST request
        - In body accept  {token, route_id,route_no,vehicle_no,driver_id} 

### api/admin/route

        - GET request
        - give me all routes details with full data of drivers and stops.

### api/admin/route/add-stop-to-route

        - POST request
        - In request body {token, route_id,stop_id} , give you route_id in which add stop and stop_id ref to stop table row.

### api/admin/route/remove-stop-from-route

        POST request
        In request body {token, route_id,stop_id} , give you route_id in which remove stop and stop_id ref to stop table row.



## LogIn/Register Functionality(User Panel) :

### api/user/login 

       -  POST request
       - In request.body contains { eamil, password }
       - If the user is not verified , then send back {msg:"check email for verifcation"}
       - This will response you object as {token:"" , data:{username, id, email} }

### api/user/register

        - POST request
        - In request.body contains { name, email, password }
        - This will send object which show "check email for verifcattion"
        e,g  {msg:"check email for verifcation"}

### api/user/verify/:token

       - GET request 
       - In request.params { token }
       - This will response you object as {token:"" , data:{username, id, email} }

### api/user/

        - GET request 
        - In request.body contains { token }
        - This will response you object as {token:"" , data:{username, id, email} }

### api/user/forget-password

        - POST request
        - In request.body contains { email }
        send an email when you click on this , then open a page , enter you new password for changing

### api/user/forget-password/verify/:token

        - POST request
        - In request.body contains { password } 
        - This will response you success if password is change and you navigate to login page for login

    



