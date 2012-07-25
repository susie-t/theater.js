var img = [
  "img/sample1.gif",
  "img/sample2.gif"
];
var scenario = [
  function(){
    this.act({
      img: "img/sample1.gif",
      msg: "ƒeƒXƒg"
    });
  },
  function(){
    this.act({
      img: "img/sample2.gif",
      msg: "‚æ‚¤‚±‚»"
    });
  }
];
new Theater({
  img: img,
  scenario: scenario
});
