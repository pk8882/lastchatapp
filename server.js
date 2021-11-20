
const express=require('express')

const app=express()
const http=require('http').createServer(app);

const PORT=process.env.PORT || 3000
http.listen(PORT,() =>{
console.log(`Listening on port ${PORT}`)
})
app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
   res.sendFile(__dirname+'/index.html')
})

// socket io
// socket.io connected
const io=require('socket.io')(http)

io.on('connection',(socket)=>{
console.log('connected...')
socket.on('new-user-joined',(username)=>{
   socket.broadcast.emit('user-join',username);
})
socket.on('message',(msg)=>{
socket.broadcast.emit('message',msg)
})
// Recieve typing effect event
socket.on('typing',(username)=>{
   socket.broadcast.emit('typing',username)
});

// socket.io disconnected
socket.on('disconnect',()=>{
   socket.broadcast.emit('left');
});

});


