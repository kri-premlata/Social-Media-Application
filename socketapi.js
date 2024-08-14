const io = require("socket.io")();
const userModel = require("./models/userschema");
const messageModel = require('./models/messageschema');
const socketapi = {
  io: io,
};


// Add your socket.io logic here!

// ----this function runs whenever a user connected (it would be multiple times)-----------------
io.on("connection", function (socket) {             
  console.log("A user connected");

  socket.on('join',async username =>{
    await userModel.findOneAndUpdate({
        username
    },{
        socketId: socket.id
    })
    // console.log(username , socket.id);
    //   console.log(socket.id);
  })

  socket.on('sony',async MessageObject =>{
    const receiver = await userModel.findOne({
        username: MessageObject.receiver
    })
    const socketId = receiver.socketId
    
    await messageModel.create({
        sender: MessageObject.sender,
        receiver: MessageObject.receiver,
        text: MessageObject.message
    });


    // below line send the message to the receiver only,
    // "socket.to" is responsible for one to one message/communication
    socket.to(socketId).emit('max',MessageObject)        


    // console.log(socketId);
    // console.log(MessageObject);
  })

  socket.on('openChat', async userObject =>{
    const {sender, receiver} = userObject
    const messages = await messageModel.find({
        $or: [{
         sender: sender,
         receiver: receiver
         },{
             sender: receiver,
             receiver: sender
        }]
     })
     socket.emit("openChat",messages)
    //  console.log(messages);


// -----------Another WAY OF WRITING THE SAME ABOVE CODE
    // const messages = await messageModel.find({
    //    $or: [{
    //     sender: userObject.sender,
    //     receiver: userObject.receiver
    //     },{
    //         sender: userObject.receiver,
    //         receiver: userObject.sender
    //    }]
    // })
    // console.log(messages);

//---------Find all chats between sender & receiver 
    // const messages = await messageModel.find({
    //     sender:'premlata',
    //     receiver:'demo'
    // })
    // console.log(messages);

     
//------------console sender & receiver
  
    // console.log(userObject);
  })
//   socket.on('max',(message)=>{
//     console.log(message);
//   })
});
// end of socket.io logic

/*
socket - single user/browser
io- server
emit - send data
on - recieve/listen data
*/

module.exports = socketapi;
