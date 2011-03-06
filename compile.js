//
// Forth-like-language that compiles to small (< 1K) JavaScript files.
//
function trim(s) {
      return s.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
};

fs = require("fs");
_ = require("underscore");
if(process.argv.length != 3 
  || process.argv[2].slice(-4) !== ".f1k") {
    console.log("Usage: node compile.js $infile.f1k");
    process.exit();
}

lines = fs.readFileSync(process.argv[2], "utf8").split("\n");

fn = {};

for(i=0;i<lines.length;++i) {
    line = trim(lines[i]);
    if(line === "" || line.slice(0,2) === "//") {
        continue;
    }

    pos = 0;
    while(line[pos] != ' ') {
        ++pos;
    }
    name = line.slice(0,pos);
    fn[name] = [];
    while(line[pos] === ' ') ++pos;

    while(pos < line.length) {
        pos0 = pos;
        if(line[pos] === '"') {
            ++pos;
            while(pos<line.length && line[pos] !== '"') {
                ++pos;
            }
            ++pos;
            fn[name].push(["string", line.slice(pos0, pos)]);
        } else if(line[pos] === '$') {
            while(pos < line.length && line[pos] !== ' ') { ++pos; }
            fn[name].push(["builtin", parseInt(line.slice(pos0+1))]);
        } else if('0' <= line[pos] && line[pos] <= '9') {
            while(pos < line.length && line[pos] !== ' ') { ++pos; }
            fn[name].push(["num", parseInt(line.slice(pos0))]);
        } else if(line[pos] === "'") {
            while(pos < line.length && line[pos] !== ' ') {
                ++pos;
            }
            fn[name].push(["quote", line.slice(pos0+1, pos)]);
        } else {
            while(pos < line.length && line[pos] !== ' ') {
                ++pos;
            }
            fn[name].push(["call", line.slice(pos0, pos)]);
        }
        while(line[pos] === ' ') ++pos;
    }
}
console.log(fn);

//
// Code generator
//
codestr = "\x02\x01\x05~console.log('Hello world')";
fncount = 1;
splitsymb = "~";
interpreter = fs.readFileSync("interpreter.js", "utf8");
code = interpreter.replace("$CODESTR", '"' + codestr + '"');
code = code.replace("$SPLITSYMB", '"' + splitsymb + '"');
code = code.replace("$FNCOUNT", fncount);

fs.writeFileSync("f1k.out.js", code, "utf8");

fs.writeFileSync("f1k.out.html", '<!doctype html><html> <head> <title>JS1k, 1k demo submission [ID]</title> <meta charset="utf-8" /> </head> <body> <canvas id="c"></canvas> <script> var b = document.body; var c = document.getElementsByTagName(\'canvas\')[0]; var a = c.getContext(\'2d\'); document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218 </script> <script> // start of submission //\n' + code + '\n// end of submission // </script> </body> </html>', "utf8");
