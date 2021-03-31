const chatForm = document.getElementById("chat-form");
const chatDiv = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const lst = document.getElementById("users");
//  Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//Join chat
socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  // console.log(message)
  outputMessage(message);
  chatDiv.scrollTop = chatDiv.scrollHeight;
});

socket.on("userAndRoom", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let msg = e.target.elements.msge.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }
  //Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msge.value = "";
  e.target.elements.msge.focus();
});

function outputMessage(msg) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("message");
  newDiv.innerHTML = `<p class="meta"> ${msg.userName} <span>${msg.time}</span></p>
                    <p class="text"> ${msg.text}</p>`;
  chatDiv.appendChild(newDiv);
}

function outputRoomName(room) {
  roomName.innerText = room;
}
function outputUsers(users) {
  lst.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}  
  `;
}

document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
