$(document).ready(function(){

    var url = "https://id.wikiquote.org/w/api.php";
    var bukanIsi = [];
    var isi = [];
    var badPreSufWords = ["dan", "atau", "artinya"];

    function render() {
        var html = "";
        html += bukanIsi[0] + ",<br>";
        html += bukanIsi[1] + ",<br>";
        html += isi[0] + ",<br>";
        html += isi[1] + ".<br>";
        $("#pantun").html(html);
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
                   s = s.split(/\.|-|:|\n|\(|\)|,/);
                   s = cleanList(s);

                   for (var i=0;i<s.length && i<2;i++) {
                       bukanIsi.push(s[i]);
                   }
                   if (bukanIsi.length < 2)
                       generateBukanIsi();
                   else {
                       generateIsi();
                   }
               }
           });
    }

    function cleanList(list) {
        for (var i=0;i<list.length;i++) {
            list[i] = list[i].trim();
        }
        list = list.filter(function(a){
            var li = a.split(" ");
            if (badPreSufWords.indexOf(li[0])!=-1) return false;
            if (badPreSufWords.indexOf(li[li.length-1])!=-1) return false;
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
        $("#pantun").html("Generating... Please wait... Sabar ya...");
        generateBukanIsi();
    });
});