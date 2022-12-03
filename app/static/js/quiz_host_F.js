// const fs = require("fs");

//문제 작성후 저장 json형식으로 변환
var q_list=[]; //json형태로 저장한 문제리스트
var count=0; //추가된 항목의 개수

function saveData() {
    var set_times=$('.formid').find('input[id=time]').val();

    var qu="";
    var op1="";
    var op2="";
    var op3="";
    var op4="";
    var ans="";
    var str="";
    for (var i=0; i<count+1; i++) {
        qu=$('.q').eq(i).find('input[id=question]').val();
        op1=$('.q').eq(i).find('input[id=option1]').val();
        op2=$('.q').eq(i).find('input[id=option2]').val();
        op3=$('.q').eq(i).find('input[id=option3]').val();
        op4=$('.q').eq(i).find('input[id=option4]').val();
        ans=$('.q').eq(i).find('input[id=answer]').val();

        jsonObject={
            question:"",
            option1:"",
            option2:"",
            option3:"",
            option4:"",
            answer:""
        }
    
        jsonObject.question=qu;
        jsonObject.option1=op1;
        jsonObject.option2=op2;
        jsonObject.option3=op3;
        jsonObject.option4=op4;
        jsonObject.answer=ans;

        q_list[i]=jsonObject;
    };

    str=JSON.stringify(q_list);

    $.ajax({
        type: 'POST',
        url: '/save_quiz',
        data: JSON.stringify(q_list),
        dataType: 'JSON',
        contentType: "application/json",
        success: function(){
            alert("saved!");
        },
        error: function(error){
            alert(error);
        }
    })

    // fs.writeFileSync('quiz.json', q_list);
    
    document.getElementById('showJson').innerHTML=str;//저장된 json내용 확인(나중에 삭제)
    var number="문제수: "+$('quiz').length;
    document.getElementById('Q_num').innerHTML=number; //문제개수확인(나중에 삭제)
    document.getElementById('TIME').innerHTML="제한시간: "+set_times+"초";

    // fs.writeFileSync("text.json",str);
}

//문항추가
function addQuestion(){
    var Item='<quiz class=q>';
        Item+="    <div class=input-group>";
        Item+='        <label>question</label>';
        Item+='        <qu><input type="text" class="question" id="question"><br></qu>';
        Item+='        <label>option1</label>';
        Item+='        <op1><input type="text" class="option1" id="option1"><br></op1>';
        Item+='        <label>option2</label>';
        Item+='        <op2><input type="text" class="option2" id="option2"><br></op2>';
        Item+='        <label>option3</label>';
        Item+='        <op3><input type="text" class="option3" id="option3"><br></op3>';
        Item+='        <label>option4</label>';
        Item+='        <op4><input type="text" class="option4" id="option4"><br></op4>';
        Item+='        <label>answer</label>';
        Item+='        <op5><input type="text" class="answer" id="answer"><br></op5>';
        Item+='        <br>'
        Item+='    </div>';
        Item+='</quiz>';
        
    if (count<4){ //4번이상 추가하지 못하도록 제한.(나중에 수정가능)
        $(".formid").append(Item);
        count++;
    }
}
//문항삭제. 1개남으면 더이상 삭제 못하도록
function deleteQuestion(){
    if(count > 0) {
        $(".q:last").remove();
        count--;
        for (var i=$('quiz').length;i>=count;i--){//delete되면 그안에 있던 내용도 삭제 하고 null처리
            q_list[i]=null;
        }
    }
}
//1)문제가 for문 돌면서 잘 저장되나 확인. (완료)
//2)이후 js파일로 어떻게 넘길것인가 고민.(json배열을 바로 script로 넘기는거?)
   //-여기까지 하면 script.js로 넘어가서 코드 수정필요.
//3) css만지기. 
//4) json빈칸인 항목은 배열에 저장 안하기(개수를 0으로 치기?) 코드.
// export {q_list};

//txt,or json 파일로 빼내서 다른 쪽에서 읽어오기 export는 오류. 다른방법?
