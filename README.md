Alexandria Plays
======================

Web client-side code for the Alexandria Plays web project.

Note that this does not include the server side.  For that, look at the projectplay-server project.

##Getting started

To get up and running with the new scripts optimization process.

**Install [node.js](http://nodejs.org)**

Once you have installed node.js in the base folder of the project run:

```
npm install
```

##Adding new javascript files to the project
If you add a new file to the project, you must add it to the files array in gulpfile.js at the top of the file.

```
var files = [ "js/jquery.js", "js/jquery-migrate.min.js", ...
];

```

##Compiling / Creating a single javascript file for the project

Whenever you change (or add) any of the script files in the files array, you will
to concatenate and uglify the file (this takes all the files in the files array
  and merges them into a single file and then minifies them, this process makes
  the files smaller and creates less HTTP requests to the site).

```
gulp scripts

```

To setup a process that will automatically recompile the javascript files everytime you edit them:


```
gulp watch
```
