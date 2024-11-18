
# UET Routes Management System

This is the backend of my project, in this project have routes:

## LogIn/Register Functionality :

### api/user/login 

        POST request
        In request.body contains { eamil, password }
        If the user is not verified , then send back {msg:"check email for verifcation"}
        This will response you object as {token:"" , data:{username, id, email} }

### api/user/register

        POST request
        In request.body contains { name, email, password }
        This will send object which show "check email for verifcattion"
        e,g  {msg:"check email for verifcation"}

### api/user/verify/:token

        GET request 
        In request.params { token }
        This will response you object as {token:"" , data:{username, id, email} }

### api/user/

        GET request 
        In request.body contains { token }
        This will response you object as {token:"" , data:{username, id, email} }

    



