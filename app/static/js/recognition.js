var sio = io();
const user_Id = document.getElementById("login_user_id");
let id = user_Id.innerText;

// 1928030:attend
sio.on("onalert", (id) => {
  console.log(id);
  let wrapper = document.getElementById(`member__${id}__wrapper`);
  let span = wrapper.querySelector("span");
  span.className = "";
  span.classList.add("green__icon");
});

sio.on("offalert", (id) => {
  console.log(id);
  let wrapper = document.getElementById(`member__${id}__wrapper`);
  let span = wrapper.querySelector("span");
  span.className = "";
  span.classList.add("red__icon");
});

// 1928030:hand
sio.on("handalert", (msg) => {
  console.log(msg);
  let handId = msg.split(":")[0];
  let wrapper = document.getElementById(`member__${handId}__wrapper`);
  let span = wrapper.querySelector("span");
  span.className = "";
  span.classList.add("hand__icon");
});
