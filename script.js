var title = document.getElementById("title");
var award = document.getElementById("award");
var candidate = document.getElementById("candidate");
var result = document.getElementById("result");
var award_file_btn = document.getElementById("award_file");
var candidate_file_btn = document.getElementById("candidate_file");
var draw_btn = document.getElementById("draw");
var all_result_btn = document.getElementById("all_result");
var download_btn = document.getElementById("download");
var erase_btn = document.getElementById("erase");

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
    //console.log(this.files[0].type);
    //award_file_btn.value="";
})


candidate_file_btn.addEventListener("change", function(){
    var file = new FileReader(); 
    file.onload = function(){
        candidate.value = file.result;
    }
    file.readAsText(this.files[0]);
    //candidate_file_btn.value="";
})

var candidate_array = new Array();
var award_array = new Array();
var award_cnt=0;
var candidate_cnt=0;
var all_result = [["中獎人","獎品名稱"]];

draw_btn.addEventListener("click", function(){
    if(candidate.value==""||award.value==""){
        alert("請輸入獎項與候選者名單!");
    }else{
        if(award_cnt==0){
            candidate_array = candidate.value.split(/[(\r\n)\r\n]+/);
            candidate_array = c_random(candidate_array);
            award_array = award.value.split(/[(\r\n)\r\n]+/);
            //var award_list = new Array();
        }
        if(award_cnt < award_array.length){
            var award_list = new Array();
            if(award_array[award_cnt].search(",")!=-1){
                var tmp_array = award_array[award_cnt].split(",");
                award_list.push(["獎品名稱:"+tmp_array[0]+"\n"+"將抽出"+tmp_array[1]+"人"]);
                award_list.push(["===================="]);
                a_num = parseInt(tmp_array[1]);
                for(var j=0; j<a_num; j++){
                    all_result.push([candidate_array[candidate_cnt],tmp_array[0]]);
                    award_list.push([candidate_array[candidate_cnt]]);
                    candidate_cnt++;
                }
                //award_list.push([tmp_array[0],parseInt(tmp_array[1])]);
            }else{
                award_list.push(["獎品名稱:"+award_array[award_cnt]+"\n將抽出1人"]);
                award_list.push(["===================="]);
                all_result.push([candidate_array[candidate_cnt],award_array[award_cnt]]);
                award_list.push([candidate_array[candidate_cnt]]);
                candidate_cnt++;
                //award_list.push([award_array[i],1]);
            }
            award_cnt++;
            result.value = award_list.join("\n");
        }else{
            result.value="";
            alert("所有獎項已抽取完畢!");
        }
    }
})

all_result_btn.addEventListener("click", function(){
    if(all_result.length>1){
        result.value = all_result.join("\n");
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
        title.value="得獎名單";
    }
    if(all_result.length>1){
        download(title.value,all_result.join("\n"));
    }
    else{
        alert("尚未進行抽獎");
    }
})

erase_btn.addEventListener("click", function(){
    title.value="";
    award.value="";
    candidate.value="";
    result.value="";
    award_file_btn.value="";
    candidate_file_btn.value="";
    award_cnt=0;
    candidate_cnt=0;
    candidate_array.length = 0;
    award_array.length = 0;
    all_result.length = 0;
    all_result = [["中獎人","獎品項目"]];
})
