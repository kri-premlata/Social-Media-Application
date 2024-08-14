Step 1: Create Express Generator boilerplate 
Step 2: In package.json/scripts create dev script 
Step 3: create .env and .gitignore file 
Step 4. install package dotenv mongoose 
Step 5: configure .env in app.js 1st line 
Step 6. generate .gitignore online node content and paste it 
Step 7. create models/database.js folder and file and write the connection code register URI in .env 
Step 8. Get the Mongo Uri from mongo atlas connect/mogodb for vscode 
Step 9: require the database.js file in app.js 
Step 10. Create index.routes.js and user.route.js and require in app.js 
Step 11. Create Partials in views and use tailwind cdn 
Step 12. create pages according to nav links in index.routes.js 
Step 13. create login register and forget ejs page. 
Step 14. Create profile.ejs page as well 
Step 15: install npm i --save passport passport-local passport-local-mongoose express-session 
Step 16: Configure Passport Boilerplate 
     i. changes in user.schema.js 
     ii. changes in app.js 
     iii. changes in user.routes.js 
Step 16: Register User in the database 
Step 17: Make Login router with middleware 
Step 18: Middleware isLoggedIn in middleware/auth.js for page authentication 
Step 19: Logout Functionality


Step 20: Create "OTP" field in user.schema.js and Create forgetemail.ejs -> /forget-email GET 
Step 21: create /user/send-mail/:id POST and call sendmail function 
Step 22: To send mail install nodemailer(npm i nodemailer) and create utils/sendmail.js file and create boilerplate -> redirect to /verify-otp/:id GET 
Step 23: Create forgetOTP.ejs and take the otp and compare with db in user/verify-otp/:id POST and redirect to /login


STEP 24: Create setting.ejs and /user/setting GET to Update user details and avatar 
STEP 25: Create form to upload image in /user/avatar/:id POST 
STEP 26: install express-fileupload (npm i express-fileupload --save) and in app.js initialize express-fileupload 
STEP 27: in /user/avatar/:id write code to upload image and redirect to /user/settings GET 
STEP 28: in /user/avatar/:id we will write the code to save image in database
STEP 29: install imagekit and utils/imagekit.js create boilerplate, define all the keys and endpoint-url and export
         (npm install imagekit --save and and copy paste Initialization code of imagekit in utils/imagekit.js file).

STEP 30: In Schema change that avatar to {fieldID: String, url: String,thumbnailUrl:String}
STEP 31 create GET /user/delete/:id to delete to delete user and image from the imagekit as well


STEP 32: created /user/update/:id POST to update user details 
STEP 33: created reset.ejs page and /user/reset-password/:id GET to show reset.ejs page 
STEP 34: create /user/reset-password/:id POST to reset password

Next Topics:-
1. reference Schema
2. 


<!-- Populate :- We use populate keyword for the aggregation of the pipeline which gives the data of the user when they created new one -->

<!-- Socket io:- Socket is almost similar to the http where a client send the request to the server
                 where they created the connection between the client & server but the main difference came between http & socket io is that the http break the connection after each connection so for http needs to make connection each & every request.
                 Here Socket io is the different from the http that socket doesn't need to create connection on each & every request, it created the connection at a once after a request, it won't break the connection . It will break the connection when the server will off .   -->

<!-- broadcast - send to all users
io - all users/browsers
socket.emit - send to single user/browser
io.emit - send to all users/browsers
socket.on - listen for event from single user/browser
io.on - listen for event from all users/browsers -->



<!-- $ne:- It means not equal , it provide the functionality to compare the coming data then will move forward  -->
STEP 35: install socket.io and socket.io-client (command - "npm i socket.io") and in app.js initialize socket.io
STEP 36: create /user/online GET and /user/online POST to send online status
STEP 37: create /user/online/:id GET and /user/online/:id POST
STEP 38: create /user/online/:id/:status POST to send online status
STEP 39: create /user/online/:id/:status POST to send online status
