# f1k - Forth-like-language for 1 Kilobyte applications.

Forth-like language for compact JavaScript programs.
The language runtime is less than 200bytes JavaScript, 
and the binary compiled f1k code chould be much more condensed 
than JavaScript, so this should enable more stuff to be
fitted in in a [js1k](http://js1k.com) competition entry.

There is one word-definition per line in a source code file.
The first word on the line is the name of newly defined word,
which is then followed by it definition, which is a list
containing any of the following:

- words, which are executed, with parameters via the stack as usual in Forth
- integers, which are pushed onto the stack
- strings, with double quotes, are pushed onto the stack
- a single quote, followed by the word - inspired by atoms in lisp - pushes a word-id (int) onto the stack.
- code within curly braces, - pushes a new word-id to the stack, which can be used to evaluate the code
