function X(c) {
    for(i=0;o=S[c].charCodeAt(i++);o&2?A.push(o&1?n:S[n+$FNCOUNT]):o&1?J[n]():X(n)) {
        n=o>>2;
    }
}
A=[];
J=[function(){J.push(Function(A.join('')))}];
S=$CODESTR.split($SPLITSYMB);
X(0)
