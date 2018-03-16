var match_keys = ['0','0','0','0','0','0','0','0','0'];
var idx;
var handle;

$(function() {
              var data=[{
              url: 'http://www.cricbuzz.com/cricket-match/live-scores',
              selector: 'div.cb-schdl',
              loop: true,
              result:[{
                  name:'title',
                  find:'a.text-hvr-underline',
                  grab:{
                      by:'attr',
                      value:'title'
                      }},
                      {
                        name: 'link',
                        find:'a.text-hvr-underline',
                        grab:{
                           by:'attr',
                           value:'href'
                        }
                      }]
                }];
      
      ygrab(data, function(result) {
            //console.log(JSON.stringify(result, null, 2));
            //alert(result);
            publishLinks(result);
            });
      
      });

function publishLinks(json) {
  for (var i = 1, j = 1; j < 9 && i < json.length; i++) {
    var mat = json[i];
    if (mat["link"]) {
      var match_key = mat["link"].match(/\/([0-9]*)\//)[1];
      window.match_keys[j] = match_key;
      //document.getElementById(j).addEventListener("click", pullCommentary(match_key));
      //console.log(match_key);
      //document.getElementById(j).href = "http://cricbuzz.com" + mat["link"];
      //document.getElementById(j).href = match_key;
      var id = "#" + j;
      $(id).text(mat["title"]);
      /*document.getElementById(j).addEventListener("click", function() {
        pullCommentary(this);
      });*/
      j++;
    }
    //console.log(match);
    /*$('<button/>', {
      text: match["title"], //set text 1 to 10
      href: 'http://cricbuzz.com' + match["link"],
      //id: 'btn_'+i,
      //click: function () { alert('hi'); }
    });*/
  }
}

function luisTest(str) {
  //alert("hello");
  var url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/98acdae9-dd50-4fb3-af81-15544136af6a?subscription-key=61f66757370046728165153de7cc2ba1&verbose=true&timezoneOffset=0&q=" + encodeURI(str);
  //var url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c5afdcc3-c063-485a-b7e5-5b14e42d1aac?subscription-key=3abc9407eacb4ce1baec51cfd0306bfc&verbose=true&timezoneOffset=0&q=" + encodeURI(str);
  //var url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/98acdae9-dd50-4fb3-af81-15544136af6a?subscription-key=a979e468d8ae45979e1d1ecc503886d9&verbose=true&timezoneOffset=0&q=" + encodeURI(str);
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false);
  //xhttp.withCredentials = true;
  //xhttp.setRequestHeader("Origin", "http://localhost:8080")
  //console.log(xhttp);
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  //console.log(response["intents"][1]["score"]);
  return response["intents"][1]["score"];
  //alert
  //document.getElementById('comm').innerHTML += str + xhttp.responseText;
  //$("#comm").append(str + xhttp.responseText + "<br>");
  //console.log(str + xhttp.responseText);
}

function pullCommentary(id) {
  if (handle) {
    clearInterval(handle);
  }
  var match_key = match_keys[id];
  var url = "https://cors-anywhere.herokuapp.com/http://www.cricbuzz.com/match-api/" + match_key + "/commentary-full.json";
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false); // false for synchronous request
  //xhttp.setRequestHeader("Content-Type", "text/plain")
  //console.log(xhttp);
  xhttp.send();
  var response = xhttp.responseText;
  var match_stat = JSON.parse(response);
  var lines = match_stat["comm_lines"];
  document.getElementById("comm").innerHTML = "";
  document.getElementById("end-hgl").style.display = "none";
  idx = 0;
  document.getElementById("loader").style.display = "block";
  handle = setInterval(function() {
    runLines(lines)
    idx++;
    if (idx >= lines.length) {
      clearInterval(handle);
      document.getElementById("loader").style.display = "none";
      document.getElementById("end-hgl").style.display = "block";
    }
  }, 3000);
  /*if (idx > 20) {
    clearInterval(handle);
    document.getElementById("loader").style.display = "none";
  }*/

}
  //console.log(lines);
  //encodeURI("Stokes to Santner, no run, punched back to the bowler");
  //luisTest(encodeURI);

  //alert(lines[8]["comm"])
  //document.getElementById('comm').innerHTML = match_stat["comm_lines"][0]["comm"].replace(/<.*?>/g, '');
function runLines(lines) { 
  for (; idx < lines.length; idx++) {
    try { 
      if (lines[idx]["comm"] && lines[idx]["b_no"] && lines[idx]["evt"]) {
        var comm_line = lines[idx]["comm"].replace(/<[^>]*>/g, "");
        var b_no = lines[idx]["b_no"];
        var event = lines[idx]["evt"];
        /*if (event != "other" && event != "four") {
          document.getElementById("comm").innerHTML += comm_line + "<br><br>";
        }*/
        //console.log(comm_line);
        //alert(line);
        //document.getElementById('comm').innerHTML += match_stat["comm_lines"][0]["comm"].replace(/<.*?>/g, '') + '\n';
        //alert(line);
        //console.log(luisTest(b_no + " " + event + " " + comm_line));
        /*if (luisTest(b_no + " " + event + " " + comm_line) > 0.5) {
          //console.log(comm_line);
          document.getElementById("comm").innerHTML += comm_line + "<br><br>";
        }*/
        //console.log(luisTest(b_no + " " + event + " " + comm_line));
        if (luisTest(b_no + " " + event + " " + comm_line) > 0.1) {
          //document.getElementById("comm").innerHTML += comm_line + "<br><br>";
          //console.log(b_no + " " + event + " " + comm_line);
          $("#comm").append("<b>" + b_no + "</b>" + " " + event + " " + comm_line + "<br><br>");
        }
      }
      if (idx % 10 == 0) {
        return;
      }
    } catch(TypeError) {
      continue;
    }
  }
}