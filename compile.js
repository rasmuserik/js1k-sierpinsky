// Forth-like-language that compiles to small (< 1K) JavaScript files.
fs = require("fs");
if(process.argv.length != 4 
  || process.argv[2].slice(-4) !== ".f1k"
  || process.argv[3].slice(-3) !== ".js") {
    console.log("Usage: node compile.js $infile.f1k $outfile.js");
    process.exit();
}

c = fs.readFileSync(process.argv[2], "utf8");

codestr = c;
fncount = 3;
splitsymb = "~";
codestr = "function X(c){for(i=0;o=S[c][i++];o&2?A.push(o&1?n:S[n+" + fncount + "]):o&1?J[n]():X(n))n=o>>2}A=[];J=[function(){J.push(Function(A.join('')))}];S='" + codestr + "'.split('" + splitsymb + "');X(0)";
fs.writeFileSync(process.argv[3], codestr, "utf8");

fs.writeFileSync(process.argv[3] + ".html", '<!doctype html><html> <head> <title>JS1k, 1k demo submission [ID]</title> <meta charset="utf-8" /> </head> <body> <canvas id="c"></canvas> <script> var b = document.body; var c = document.getElementsByTagName(\'canvas\')[0]; var a = c.getContext(\'2d\'); document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218 </script> <script> // start of submission //\n" + codestr + "\n// end of submission // </script> </body> </html>', "utf8");
