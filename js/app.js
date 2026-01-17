const MY_ID = "besirhas";
const peer = new Peer(MY_ID);

let conn;
let stream;

peer.on("open", () => {
  document.getElementById("status").innerText = "Online";
});

peer.on("connection", c => {
  conn = c;
  document.getElementById("status").innerText = "Bağlandı";

  conn.on("data", msg => {
    addMessage("Arkadaş", msg);
  });
});

function connectUser() {
  const id = document.getElementById("targetId").value;
  if (!id) return;

  conn = peer.connect(id);

  conn.on("open", () => {
    document.getElementById("status").innerText = "Bağlandı";
  });

  conn.on("data", msg => addMessage("Arkadaş", msg));
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  if (!conn || input.value === "") return;

  conn.send(input.value);
  addMessage("Sen", input.value);
  input.value = "";
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<span>${sender}:</span> ${text}`;
  document.getElementById("messages").appendChild(div);
}

async function startVoice() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const call = peer.call(conn.peer, stream);

  peer.on("call", call => {
    call.answer(stream);
  });
}
