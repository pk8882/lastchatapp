const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area');
var btn=document.querySelector("button");
var nmuse=document.querySelector(".username p");


// disavle button
btn.disabled=true;
var username=document.querySelector(".name");
username.addEventListener('keyup',(e)=>{
    if(e.target.value==""){
        btn.disabled=true;
        alert("Please fill the form");
    }
    else{
        btn.disabled=false;
    }
});

btn.addEventListener("click",()=>{
    let user=document.querySelector(".name").value;
    name=user;
    let form=document.querySelector(".container");
    form.style.display="none";
    nmuse.innerHTML=username.value;
    let chat=document.querySelector(".chat__section ");
    chat.style.display="block";
    socket.emit('new-user-joined',username.value);

});




textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})
// typing effects
textarea.addEventListener('keyup',(e)=>{
    socket.emit('typing',username.value);
});

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

function joinuser(username) {
   alert(`${username} has join the chat`);
}

function leftchat(){
    alert(`User has left the chat`);
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})
socket.on('user-join',(username)=>{
    joinuser(username)
});
socket.on('left',()=>{
    leftchat();
});

// debounce
let timerid=null;
function debounce(func,timer){
    if(timerid){
        clearTimeout(timerid)
    }


    timerid=setTimeout(()=>{
        func()
    },timer);
}

let typingdiv=document.querySelector(".username span");
socket.on('typing',(username)=>{
    nmuse.innerHTML=`${username} is typing...`
   debounce(()=>{
    nmuse.innerHTML=''
   },1000)
   
});


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}




