const { Parser } = require('acorn');

const script = `
  var prevLink = true;
  var nextLink = true;
  var nextChapterLink = "/rashititel_grobnic__A5327/vol1/334";
  
  rm_h.initReader( [2,3], [['https://h2.rmr.rocks/','',"auto/61/84/16/1.png_res.jpg?t=1663238872&u=0&h=zks_HbrT5YKHvMUieOQe3Q",1080,25770],['https://h16.rmr.rocks/','',"auto/61/84/16/2.png_res.jpg?t=1663238872&u=0&h=cJqQUys-xjuRmsP-t2yPyQ",1080,30369],['https://h15.rmr.rocks/','',"auto/61/84/16/3.png_res.jpg?t=1663238872&u=0&h=0tnYbMIeSq_8N85BBEOKTQ",1080,24538],['https://h11.rmr.rocks/','',"auto/61/84/16/4.png_res.jpg?t=1663238872&u=0&h=he-VrPldKy9JZ5k7Z7Acng",1080,28293],['https://h3.rmr.rocks/','',"auto/61/84/16/5.png_res.jpg?t=1663238872&u=0&h=5LfiJj5FUj6c1nYK4CevVQ",1080,38433]], 0, false, [{"path":"https://h1.rmr.rocks/","res":true},{"path":"https://h3.rmr.rocks/","res":true},{"path":"https://h2.rmr.rocks/","res":true},{"path":"https://h17.rmr.rocks/","res":true},{"path":"https://h11.rmr.rocks/","res":true},{"path":"https://h16.rmr.rocks/","res":true},{"path":"https://h15.rmr.rocks/","res":true},{"path":"https://h13.rmr.rocks/","res":true}], false);
`;

console.log(script.match(/rm_h\.initReader\(.+,(.*)/));
