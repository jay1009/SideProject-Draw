var title = document.getElementById("title");
var award = document.getElementById("award");
var candidate = document.getElementById("candidate");
var winner = document.getElementById("winner");
var award_file_btn = document.getElementById("award_file");
var candidate_file_btn = document.getElementById("candidate_file");
var draw_btn = document.getElementById("draw");
var all_winner_btn = document.getElementById("all_winner");
var download_btn = document.getElementById("download");
var erase_btn = document.getElementById("erase");

var candidate_array = new Array();
var award_array = new Array();
var award_cnt=0;
var candidate_cnt=0;
var all_winner = [["中獎人","獎品名稱"]];

function random(lower, upper){
    return Math.floor(Math.random()*(upper-lower+1))+lower;
}

function c_random(person){
    for(var i=0; i<person.length; i++){
        ind = random(0,person.length-1);
        var tmp = person[i];
        person[i]=person[ind];
        person[ind]=tmp;
    }
    //console.log(person);
    return person;
}


award_file_btn.addEventListener("change", function(){
    var file = new FileReader();
    file.onload = function(){
        award.value = file.result;
    }
    file.readAsText(this.files[0]);
    award_cnt=0;
    //console.log(this.files[0].type);
    //award_file_btn.value="";
})


candidate_file_btn.addEventListener("change", function(){
    var file = new FileReader(); 
    file.onload = function(){
        candidate.value = file.result;
    }
    file.readAsText(this.files[0]);
    candidate_cnt=0;
    //candidate_file_btn.value="";
})


draw_btn.addEventListener("click", function(){
    if(candidate.value==""||award.value==""){
        alert("請輸入獎項與候選者名單!");
    }else{
        //var xhr = new XMLHttpRequest();
        if(title.value==""){
            title.value="尾牙";
        }
        if(award_cnt==0){
            candidate_array = candidate.value.split(/[(\r\n)\r\n]+/);
            candidate_array = c_random(candidate_array);
            award_array = award.value.split(/[(\r\n)\r\n]+/);
        }
        if(award_cnt < award_array.length){
            var winner_list = new Array()
            var award_name = "";
            var award_num = 0;
            if(award_array[award_cnt].search(",")!=-1){
                var tmp_array = award_array[award_cnt].split(",");
                //winner_list.push(["獎品名稱:"+tmp_array[0]+"\n"+"將抽出"+tmp_array[1]+"人"]);
                //winner_list.push(["===================="]);
                award_name = tmp_array[0];
                award_num = parseInt(tmp_array[1]);
                for(var j=0; j<award_num; j++){
                    all_winner.push([candidate_array[candidate_cnt],tmp_array[0]]);
                    winner_list.push([candidate_array[candidate_cnt]]);
                    //var xhr = new XMLHttpRequest();
                    //xhr.open("GET","/senddata?&title=" + title.value + "&award=" + tmp_array[0] +"&winner=" +candidate_array[candidate_cnt]);
                    //xhr.send();
                    candidate_cnt++;
                }
                //winner_list.push([tmp_array[0],parseInt(tmp_array[1])]);
            }else{
                award_name=award_array[award_cnt];
                award_num=1;
                //winner_list.push(["獎品名稱:"+award_array[award_cnt]+"\n將抽出1人"]);
                //winner_list.push(["===================="]);
                all_winner.push([candidate_array[candidate_cnt],award_array[award_cnt]]);
                winner_list.push([candidate_array[candidate_cnt]]);
                candidate_cnt++;
                //var xhr = new XMLHttpRequest();
                //xhr.open("GET","/senddata?&title=" + title.value + "&award=" + award_array[award_cnt] +"&winner=" +candidate_array[candidate_cnt]);
                //xhr.send();
                //winner_list.push([award_array[i],1]);
            }
            
            run_num = Math.ceil(winner_list.length / 500);
            for(var i=0; i<run_num; i++){
                var start =  500 * i;
                if(i!=run_num-1){
                    var end = 500*(i+1);
                } else{
                    var end = winner_list.length;
                }
                var xhr = new XMLHttpRequest();
                xhr.open("GET","/senddata?&title=" + title.value + "&award=" + award_name +"&winner=" + winner_list.slice(start,end));
                xhr.send();
            }

            award_cnt++;
            winner_list.splice(0,0,["獎品名稱:"+award_name + "\n將抽出"+award_num+"人\n"+"===================="]);
            winner.value = winner_list.join("\n");
        }else{
            winner.value="";
            alert("所有獎項已抽取完畢!");
        }
    }
})

all_winner_btn.addEventListener("click", function(){
    if(all_winner.length>1){
        winner.value = all_winner.join("\n");
    }
    else{
        alert("尚未進行抽獎");
    }
})


function download(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href','data:text/csv;charset=utf-8,%EF%BB%BF'+encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

download_btn.addEventListener("click", function(){
    if(title.value==""){
        title_name="得獎名單";
    } else {
        title_name = title.value;
    }
    if(all_winner.length>1){
        download(title_name,all_winner.join("\n"));
    }
    else{
        alert("尚未進行抽獎");
    }
})

erase_btn.addEventListener("click", function(){
    title.value="";
    award.value="";
    candidate.value="";
    winner.value="";
    award_file_btn.value="";
    candidate_file_btn.value="";
    award_cnt=0;
    candidate_cnt=0;
    candidate_array.length = 0;
    award_array.length = 0;
    all_winner.length = 0;
    all_winner = [["中獎人","獎品項目"]];
})
/*
document.querySelector("#erase").addEventListener("click",function(){
    var title = document.querySelector("#title").value;
    var winner = document.querySelector("#winner").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/senddata?title=" + title + "&winner=" + winner);
    xhr.send();
    alert("資料已送出");

})*/