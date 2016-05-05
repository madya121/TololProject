$(document).ready(function(){

    var url = "https://id.wikiquote.org/w/api.php";
    var bukanIsi = [];
    var isi = [];
    var badPreSufWords = ["dan", "atau", "artinya", "renamed"];
    var gw = ["Please Wait", "Sabar", "Sabar ya", "Sabar dong", "Wait lah", "Ga sabaran amat", "Susah nih", "Aduh diem dong",
    "Berisik", "Woi", "Njir sabar dong", "TAI LAH YANG SABAR", "MASIH GENERATING NEH", "jing", "dasar abu monitor", "susah neh generate ginian"];
    var isGenerating;
    var gwc = 0;

    function render() {
        isGenerating = false;
        var html = "";
        html += bukanIsi[0] + ",<br>";
        html += bukanIsi[1] + ",<br>";
        html += isi[0] + ",<br>";
        html += isi[1] + ".<br>";
        $("#pantun").html(html);
        $("#facebookShare").show();
    }

    function generateBukanIsi() {
        $.ajax({
               url: url,
               dataType: 'jsonp',
               data: {
                   action: 'query',
                   generator: 'random',
                   prop: 'extracts',
                   format: 'json'
               },
               success: function(data){
                   var s;
                   for (var key in data.query.pages) {
                       if (data.query.pages.hasOwnProperty(key)) {
                           s = data.query.pages[key].extract;
                           break;
                       }
                   }
                   s = cleanHTMLTags(s);
                   s = s.split(/\.|-|:|\n|\(|\)|,|!|"/);
                   s = cleanList(s);

                   for (var i=0;i<s.length && i<2;i++) {
                       bukanIsi.push(s[i]);
                   }
                   if (bukanIsi.length < 2)
                       generateBukanIsi();
                   else {
                       generateIsi();
                       console.log(bukanIsi);
                   }
               }
           });
    }

    function cleanList(list) {
        for (var i=0;i<list.length;i++) {
            list[i] = list[i].trim();
        }
        list = list.filter(function(a){
            if (!a) return false;
            var li = a.split(" ");
            if (badPreSufWords.indexOf(li[0])!=-1) return false;
            if (badPreSufWords.indexOf(li[li.length-1])!=-1) return false;
            if (li[li.length-1]>='0' && li[li.length-1]<='9') return false;
            if (li[li.length-2]>='0' && li[li.length-2]<='9') return false;
            if (!a[0].match(/[a-z]/i)) return false;
            if (!a[a.length-1].match(/[a-z]/i)) return false;
            return a.length>=15 && a.length<=50;
        });
        return list;
    }

    function generateIsi() {
        $.ajax({
               url: url,
               dataType: 'jsonp',
               data: {
                   action: 'query',
                   generator: 'random',
                   prop: 'extracts',
                   format: 'json'
               },
               success: function(data){
                   var belakang;
                   if (isi.length > 0) {
                       belakang = bukanIsi[1].substr(bukanIsi[1].length - 2);
                   } else {
                       belakang = bukanIsi[0].substr(bukanIsi[0].length - 2);
                   }
                   var s;
                   for (var key in data.query.pages) {
                       if (data.query.pages.hasOwnProperty(key)) {
                           s = data.query.pages[key].extract;
                           break;
                       }
                   }
                   s = cleanHTMLTags(s);
                   s = s.split(/\.|-|:|\n|\(|\)|,|!|"/);
                   s = cleanList(s);
                   s = s.filter(function(a){
                       return a.substr(a.length -2) == belakang;
                   });

                   if (s.length > 0) {
                       isi.push(s[0]);
                   }
                   if (isi.length < 2)
                       generateIsi();
                   else render();
               }
        });
    }

    function cleanHTMLTags(s){
        return $(s).text();
    }

    $("#generate").click(function(){
        bukanIsi = [];
        isi = [];
        isGenerating = true;
        gwc = 0;
        $("#pantun").html("Generating...");
        generateBukanIsi();
    });

    setInterval(function(){
        if (isGenerating) {
            $("#pantun").append("<br>"+gw[Math.floor(Math.random()*gw.length)%gw.length] + "...");
        }
    }, 2000);

    $("#facebookShare").click(function(){
        var description = $("#pantun").text();
        var fbpopup = window.open("https://www.facebook.com/sharer/sharer.php?u=http://madya121.github.io/TololProject/pantungenerator/&description="+description, "pop", "width=600, height=400, scrollbars=no");
        return false;
    });
    $("#facebookShare").hide();
});