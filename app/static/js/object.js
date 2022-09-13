const screenObject = document.querySelector("#screen");
const screenList = document.querySelector("#screen_list");
const randomObject = document.querySelector("#random");
const randomList = document.querySelector("#random_list");
const groupObject = document.querySelector("#group");
const groupList = document.querySelector("#group_list");

const HIDDEN_CLASSNAME = "hidden";

function onMouseScreen(event) {
  event.preventDefault();
  screenList.classList.remove(HIDDEN_CLASSNAME);
}

function onMouseRandom(event) {
  event.preventDefault();
  randomList.classList.remove(HIDDEN_CLASSNAME);
}

function onMouseGroup(event) {
  event.preventDefault();
  groupList.classList.remove(HIDDEN_CLASSNAME);
}

function outMouseScreen(event) {
  event.preventDefault();
  screenList.classList.add(HIDDEN_CLASSNAME);
}

function outMouseRandom(event) {
  event.preventDefault();
  randomList.classList.add(HIDDEN_CLASSNAME);
}

function outMouseGroup(event) {
  event.preventDefault();
  groupList.classList.add(HIDDEN_CLASSNAME);
}

screenObject.addEventListener("mouseover", onMouseScreen);
screenList.addEventListener("mouseover", onMouseScreen);
randomObject.addEventListener("mouseover", onMouseRandom);
randomList.addEventListener("mouseover", onMouseRandom);
groupObject.addEventListener("mouseover", onMouseGroup);
groupList.addEventListener("mouseover", onMouseGroup);

// screenObject.addEventListener("mouseout",outMouseScreen);
screenList.addEventListener("mouseout", outMouseScreen);
// randomObject.addEventListener("mouseout",outMouseRandom);
randomList.addEventListener("mouseout", outMouseRandom);
// groupObject.addEventListener("mouseout",outMouseGroup)
groupList.addEventListener("mouseout", outMouseGroup);

// 랜덤추첨 기능

const chosen = document.querySelector("#chosen");
const chosenLabel = document.querySelector("#chosenUser");
const replay = document.querySelector("#reChoose");
const closeChoose = document.querySelector("#closeChoose");
const randomButton = document.querySelector("#random_button");
let users = ["이수빈", "장현아", "전지은", "최예진"]; // 접속중인 유저 리스트가 들어가도록 수정
var randomRunTime = 20;

function startTime() {
  // 일정 시간 이후 창 닫히도록
  var x = setInterval(function () {
    closeChoose.value = `닫기 ( ${randomRunTime} s)`;
    if (randomRunTime == 0) {
      chosen.classList.add(HIDDEN_CLASSNAME);
      clearInterval(x);
    } else {
      closeChoose.value = `닫기 ( ${randomRunTime} s)`;
      randomRunTime = randomRunTime - 1;
    }
  }, 1000);
}

function randomUser(event) {
  // 유저 추첨해서 창 띄워주는 함수
  event.preventDefault();
  let chosenUser = users[Math.floor(Math.random() * users.length)];
  chosenLabel.innerText = `>> ${chosenUser} <<`;
  randomRunTime = 20;
  closeChoose.value = `닫기 ( ${randomRunTime} s)`;
  chosen.classList.remove(HIDDEN_CLASSNAME);
  startTime();
}

function reChoose(event) {
  // 띄워진 창에서 유저 재추첨하는 함수
  event.preventDefault();
  randomRunTime = 20;
  closeChoose.value = `닫기 ( ${randomRunTime} s)`;
  let chosenUser = users[Math.floor(Math.random() * users.length)];
  while (chosenLabel.innerText == `>> ${chosenUser} <<`) {
    chosenUser = users[Math.floor(Math.random() * users.length)];
  }
  chosenLabel.innerText = `>> ${chosenUser} <<`;
}

function closeRandom(event) {
  // 추첨창 닫는 함수
  event.preventDefault();
  chosenLabel.innerText = "";
  chosen.classList.add(HIDDEN_CLASSNAME);
  clearInterval(x);
}

randomButton.addEventListener("click", randomUser);
replay.addEventListener("click", reChoose);
closeChoose.addEventListener("click", closeRandom);

// 소그룹

const createGroup = document.querySelector("#create_group");
const selectGroup = document.querySelector("#select_member");
const userList = document.querySelector("#user_list");
const select = document.querySelector("#select");
const closeUsers = document.querySelector("#closeUsers");
const groupMember = document.querySelector("#group_member");

const groupButtons = document.querySelector("#group_button");
const speakTo = document.querySelector("#speak_to");
const speakAll = document.querySelector("#speak_all");
const speakGroup = document.querySelector("#speak_group");
const leaveGroup = document.querySelector("#leave_group");

// 유저 리스트 로드
function addUser(username) {
  const input = document.createElement("input");
  input.classList.add("userCheck");
  input.id = username;
  input.type = "checkbox";
  input.value = username;
  const label = document.createElement("label");
  label.classList.add("user");
  label.innerText = username;
  const p = document.createElement("p");
  p.classList.add("userP");
  p.appendChild(input);
  p.appendChild(label);
  userList.appendChild(p);
}

// 그룹 멤버 선택창 열기
function openGroup(event) {
  event.preventDefault();
  var deleteP = document.querySelectorAll(".userP");
  for (var d of deleteP) {
    // console.log(d);
    d.remove();
  }
  for (var u of users) {
    addUser(u);
  }
  selectGroup.classList.remove(HIDDEN_CLASSNAME);
}

// 그룹멤버 선택창 닫기
function closeGroup(event) {
  event.preventDefault();
  selectGroup.classList.add(HIDDEN_CLASSNAME);
}

// 그룹 생성
function decideGroup(event) {
  event.preventDefault();
  var members = document.querySelectorAll(".userCheck");
  var memberList = [];
  for (var m of members) {
    if (m.checked) {
      memberList.push(m.value);
    }
  }
  groupMember.innerText = `그룹멤버: ${memberList}`;
  groupMember.classList.remove(HIDDEN_CLASSNAME);
  selectGroup.classList.add(HIDDEN_CLASSNAME);
  groupButtons.classList.remove(HIDDEN_CLASSNAME);
  speakTo.innerText = "마이크: 그룹";
}

//그룹 나가기
function deleteGroup(event) {
  event.preventDefault();
  groupButtons.classList.add(HIDDEN_CLASSNAME);
  groupMember.classList.add(HIDDEN_CLASSNAME);
  speakTo.innerText = "마이크: 전체";
}

createGroup.addEventListener("click", openGroup);
closeUsers.addEventListener("click", closeGroup);
select.addEventListener("click", decideGroup);
leaveGroup.addEventListener("click", deleteGroup);

// 마이크 전체로
speakAll.addEventListener("click", (event) => {
  event.preventDefault();
  speakTo.innerText = "마이크: 전체";
});

// 마이크 그룹으로
speakGroup.addEventListener("click", (event) => {
  event.preventDefault();
  speakTo.innerText = "마이크: 그룹";
});
