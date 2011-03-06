// Forth-like-language that compiles to small (< 1K) JavaScript files.
fs = require("fs");
if(process.argv.length != 3 
  || process.argv[2].slice(-4) !== ".f1k") {
    console.log("Usage: node compile.js $infile.f1k");
    process.exit();
}

lines = fs.readFileSync(process.argv[2], "utf8").split("\n");

//
// Code generator
//
codestr = '\x02\x01\x05~console.log("Hello world")';
fncount = 1;
splitsymb = "~";
interpreter = fs.readFileSync("interpreter.js", "utf8");
code = interpreter.replace("$CODESTR", "'" + codestr + "'");
code = code.replace("$SPLITSYMB", "'" + splitsymb + "'");
code = code.replace("$FNCOUNT", fncount);

fs.writeFileSync("f1k.out.js", code, "utf8");

fs.writeFileSync("f1k.out.html", '<!doctype html><html> <head> <title>JS1k, 1k demo submission [ID]</title> <meta charset="utf-8" /> </head> <body> <canvas id="c"></canvas> <script> var b = document.body; var c = document.getElementsByTagName(\'canvas\')[0]; var a = c.getContext(\'2d\'); document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218 </script> <script> // start of submission //\n' + code + '\n// end of submission // </script> </body> </html>', "utf8");
