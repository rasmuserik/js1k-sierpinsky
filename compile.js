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
    while(line[pos] === ' ') ++pos;

  function readDef() {
      var result, pos0; // pos and line is in external scope
      result = [];
    while(pos < line.length) {
        pos0 = pos;
        if(line[pos] === '"') {
            ++pos;
            while(pos<line.length && line[pos] !== '"') {
                ++pos;
            }
            ++pos;
            result.push(["string", line.slice(pos0+1, pos-1)]);
        } else if(line[pos] === '$') {
            while(pos < line.length && line[pos] !== ' ') { ++pos; }
            result.push(["builtin", parseInt(line.slice(pos0+1))]);
        } else if('0' <= line[pos] && line[pos] <= '9') {
            while(pos < line.length && line[pos] !== ' ') { ++pos; }
            result.push(["num", parseInt(line.slice(pos0))]);
        } else if(line[pos] === "'") {
            while(pos < line.length && line[pos] !== ' ') {
                ++pos;
            }
            result.push(["quote", line.slice(pos0+1, pos)]);
        } else {
            while(pos < line.length && line[pos] !== ' ') {
                ++pos;
            }
            result.push(["call", line.slice(pos0, pos)]);
        }
        while(line[pos] === ' ') ++pos;
    }
    return result;
  }
  fn[name] = readDef();
}



//
// Code generator
//

var i = 0;
for(x in fn) {
    fn[x].id = i;
    ++i;
}
fncount = i;

strings = [];
code = [];
for(key in fn) {
    x = fn[key];
    var s = "";
    for(i = 0; i < x.length; ++i) {
        var op;
        if(x[i][0] === "call") {
            op = 0; n = fn[x[i][1]].id;
            if(n === undefined) {
                console.log("could not find function: " + fn[i][1] + " while compiling " + x);
            }
        } else if(x[i][0] === "quote") {
            op = 3; n = fn[x[i][1]].id;
            if(n === undefined) {
                console.log("could not find function: " + fn[i][1] + " while compiling " + x);
            }
        } else if(x[i][0] === "builtin") {
            op = 1; n = x[i][1];
        } else if(x[i][0] === "string") {
            var str = x[i][1];
            if(strings[str]) {
                string_id = strings[str].id;
            } else {
                string_id = strings.length;
                strings[str] = {id: string_id};
                str = str.replace("\n", "\\n").replace("\t", "\\t").replace("\"", "\\\"").replace("\\","\\\\");
                strings.push(str);
            }
            op = 2;
            n = string_id;
        } else if(x[i][0] === "num") {
            op = 3; n = x[i][1];
        } else {
            console.log("unexpected node type: " + x[i][0]);
        }
        console.log({op: op, n: n});
        s += String.fromCharCode(op + 4*n);
    }
    code.push(x.src = s);
}

console.log(fn);
console.log(strings);


codestr = "\x02\x01\x05~console.log('Hello world')";
splitsymb = "\x00";
code.push(strings.join(splitsymb));
codestr = code.join(splitsymb);
console.log(codestr);
interpreter = fs.readFileSync("interpreter.js", "utf8");
code = interpreter.replace("$CODESTR", '"' + codestr + '"');
code = code.replace("$SPLITSYMB", '"' + splitsymb + '"');
code = code.replace("$FNCOUNT", fncount);

fs.writeFileSync("f1k.out.js", code, "utf8");

fs.writeFileSync("f1k.out.html", '<!doctype html><html> <head> <title>JS1k, 1k demo submission [ID]</title> <meta charset="utf-8" /> </head> <body> <canvas id="c"></canvas> <script> var b = document.body; var c = document.getElementsByTagName(\'canvas\')[0]; var a = c.getContext(\'2d\'); document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218 </script> <script> // start of submission //\n' + code + '\n// end of submission // </script> </body> </html>', "utf8");
